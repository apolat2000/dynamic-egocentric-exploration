const service = require('./webScraper.service');
const { v4: uuidv4 } = require('uuid');

function indexAction(req, res) {
  res.json({
    msg: 'This is not the right path. You should make a POST request to /api/v1/web-scraper/get-neighboring-web-pages-as-graph',
  });
}

async function getGraphAction(req, res) {
  try {
    const webPageURL = req.body?.webPageURL;
    const requestSecret = req.headers['x-api-key'] ?? false;

    console.log(req.headers);
    console.log(requestSecret);

    if (!requestSecret || requestSecret !== process.env.REQUEST_SECRET) {
      res.status(401).json({
        success: false,
        msg: 'Invalid API key. If you are hosting the backend and frontend on your own, read the instructions on GitHub thoroughly.',
      });
      return;
    }

    if (!webPageURL) {
      res
        .status(400)
        .json({ success: false, msg: service.errorDictionary.badRequest });
      return;
    }

    const startTimeStamp = new Date().getTime();

    const options = req.body.options || {};
    const currentGraph = req.body.currentGraph || { nodes: [], links: [] };
    const webPageName = service.deriveWebPageName(String(webPageURL));

    if (!webPageURL.match(service.urlRegex)) {
      res.status(200).json({
        nodes: currentGraph.nodes,
        links: currentGraph.links,
        success: false,
        msg: service.errorDictionary.badURL,
        webPageId: null,
        elapsedTime: new Date().getTime() - startTimeStamp,
      });
      return;
    }

    // already visited
    const findInExistingGraph = service.findInNodesByName(
      webPageName,
      currentGraph.nodes
    );
    if (
      findInExistingGraph &&
      currentGraph.nodes.some((e) => e.source === findInExistingGraph.id)
    ) {
      res.status(200).json({
        nodes: currentGraph.nodes,
        links: currentGraph.links,
        success: true,
        msg: service.errorDictionary.alreadyVisited,
        webPageId: -1,
        elapsedTime: new Date().getTime() - startTimeStamp,
      });
      return;
    }

    // run the web scraper (time-costly)
    const allAnchorHrefs = await service.scrapAnchorHrefs(webPageURL, options);

    if (allAnchorHrefs === -1) {
      res.status(200).json({
        nodes: currentGraph.nodes,
        links: currentGraph.links,
        success: false,
        msg: service.errorDictionary.cantNavigate,
        webPageId: -1,
        elapsedTime: new Date().getTime() - startTimeStamp,
      });
      return;
    }

    const pureAnchorHrefs = allAnchorHrefs.filter(
      (e) =>
        e.match(service.urlRegex) &&
        e !== '' &&
        e !== '#' &&
        !e.includes('mailto')
    );

    if (
      pureAnchorHrefs.filter(
        (url) => service.deriveWebPageName(url) !== webPageName
      ).length === 0
    ) {
      res.status(200).json({
        nodes: currentGraph.nodes,
        links: currentGraph.links,
        success: false,
        msg: service.errorDictionary.deadEnd,
        webPageId: -1,
        elapsedTime: new Date().getTime() - startTimeStamp,
      });
      return;
    }

    const allAnchorHrefsWithNameAndURL = service.uniqueBy(
      pureAnchorHrefs.map((url) => ({
        url,
        name: service.deriveWebPageName(url),
      })),
      (e) => e.name
    );

    // all outgoing hrefs, which don't already exist in current graph
    const novelNodes = service.uniqueBy(
      allAnchorHrefsWithNameAndURL
        .map((e) => {
          return service.findInNodesByName(e.name, currentGraph.nodes)
            ? false
            : { ...e, id: uuidv4() };
        })
        .filter((e) => e),
      (e) => e.name
    );

    // nodes of status quo graph, the new web page and all outgoing hrefs
    const nodes = service.uniqueBy(
      [...currentGraph.nodes, ...novelNodes],
      (e) => e.name
    );

    // get the complete object of the newly navigated web page
    const webPageInNodes = service.findInNodesByName(webPageName, nodes);

    const linkTargetsAlreadyInCurrentGraph = allAnchorHrefsWithNameAndURL
      .filter((e) => service.findInNodesByName(e.name, currentGraph.nodes))
      .map((e) => service.findInNodesByName(e.name, currentGraph.nodes));

    const novelLinkTargets = novelNodes.filter(
      (e) => !service.findInNodesByName(e.name, currentGraph.nodes)
    );

    // all new source-target tuples
    const linksToAppend = [
      ...linkTargetsAlreadyInCurrentGraph,
      ...novelLinkTargets,
    ]
      .filter((e) => e.name !== webPageName)
      .map((e) => ({
        source: webPageInNodes.id,
        target: e.id,
      }));

    const links = [...currentGraph.links, ...linksToAppend];

    res.status(200).json({
      nodes,
      links,
      success: true,
      msg: service.errorDictionary.ok,
      webPageId: webPageInNodes.id,
      elapsedTime: new Date().getTime() - startTimeStamp,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: service.errorDictionary.somethingWentWrong,
    });
  }
}

module.exports = { indexAction, getGraphAction };
