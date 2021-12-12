// init express
const cors = require("cors");
const express = require("express");
const app = express();
app.use(cors());
app.options("*", cors());

// body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// utils
const webScraper = require("./utils/webScraper");
const utils = require("./utils");
const { v4: uuidv4 } = require("uuid");

// returns the nodes and links appended to the graph sent with the request
app.post("/get-neighboring-web-pages-as-graph", async function (req, res) {
  const webPageURL = req.body.webPageURL;

  const startTimeStamp = new Date().getTime();

  const currentTime = req.body.currentTime;

  console.log(currentTime);

  if (!webPageURL.match(utils.urlRegex)) {
    console.log(new Date().getTime() - startTimeStamp);
    res.status(200).json({
      nodes: currentGraph.nodes,
      links: currentGraph.links,
      success: false,
      msg: utils.errorDictionary.badURL,
      webPageId: webPageInNodes.id,
      elapsedTime: new Date().getTime() - startTimeStamp,
    });
    return;
  }

  const options = req.body.options || {};
  const currentGraph = req.body.currentGraph || { nodes: [], links: [] };
  const webPageName = utils.deriveWebPageName(String(webPageURL));

  // already visited
  const findInExistingGraph = utils.findInNodesByName(
    webPageName,
    currentGraph.nodes
  );
  if (
    findInExistingGraph &&
    currentGraph.nodes.some((e) => e.source === findInExistingGraph.id)
  ) {
    console.log(new Date().getTime() - startTimeStamp);
    res.status(200).json({
      nodes: currentGraph.nodes,
      links: currentGraph.links,
      success: true,
      msg: utils.errorDictionary.alreadyVisited,
      webPageId: -1,
      elapsedTime: new Date().getTime() - startTimeStamp,
    });
    return;
  }

  // run the web scraper (time-costly)
  const allAnchorHrefs = await webScraper.scrapAnchorHrefs(webPageURL, options);

  if (allAnchorHrefs === -1) {
    console.log(new Date().getTime() - startTimeStamp);
    res.status(200).json({
      nodes: currentGraph.nodes,
      links: currentGraph.links,
      success: false,
      msg: utils.errorDictionary.cantNavigate,
      webPageId: -1,
      elapsedTime: new Date().getTime() - startTimeStamp,
    });
    return;
  }

  const pureAnchorHrefs = allAnchorHrefs.filter(
    (e) =>
      e.match(utils.urlRegex) && e !== "" && e !== "#" && !e.includes("mailto")
  );

  // console.log("pureAnchorHrefs", pureAnchorHrefs);

  if (
    pureAnchorHrefs.filter(
      (url) => utils.deriveWebPageName(url) !== webPageName
    ).length === 0
  ) {
    console.log(new Date().getTime() - startTimeStamp);
    res.status(200).json({
      nodes: currentGraph.nodes,
      links: currentGraph.links,
      success: false,
      msg: utils.errorDictionary.deadEnd,
      webPageId: -1,
      elapsedTime: new Date().getTime() - startTimeStamp,
    });
    return;
  }

  const allAnchorHrefsWithNameAndURL = utils.uniqBy(
    pureAnchorHrefs.map((url) => ({ url, name: utils.deriveWebPageName(url) })),
    (e) => e.name
  );

  // all outgoing hrefs, which don't already exist in current graph
  const novelNodes = utils.uniqBy(
    allAnchorHrefsWithNameAndURL
      .map((e) => {
        return utils.findInNodesByName(e.name, currentGraph.nodes)
          ? false
          : { ...e, id: uuidv4() };
      })
      .filter((e) => e),
    (e) => e.name
  );

  // nodes of status quo graph, the new web page and all outgoing hrefs
  const nodes = utils.uniqBy(
    [...currentGraph.nodes, ...novelNodes],
    (e) => e.name
  );

  // get the complete object of the newly navigated web page
  const webPageInNodes = utils.findInNodesByName(webPageName, nodes);

  const linkTargetsAlreadyInCurrentGraph = allAnchorHrefsWithNameAndURL
    .filter((e) => utils.findInNodesByName(e.name, currentGraph.nodes))
    .map((e) => utils.findInNodesByName(e.name, currentGraph.nodes));

  const novelLinkTargets = novelNodes.filter(
    (e) => !utils.findInNodesByName(e.name, currentGraph.nodes)
  );

  // console.log([...linkTargetsAlreadyInCurrentGraph, ...novelLinkTargets]);

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

  // console.log("links", links);
  // console.log("nodes", nodes);
  console.log("# of new links", linksToAppend.length);
  console.log(new Date().getTime() - startTimeStamp);
  res.status(200).json({
    nodes,
    links,
    success: true,
    msg: utils.errorDictionary.ok,
    webPageId: webPageInNodes.id,
    elapsedTime: new Date().getTime() - startTimeStamp,
  });
  return;
});

app.listen(8000, "10.101.249.13");
