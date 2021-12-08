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
const webScrapper = require("./utils/webScrapper");
const utils = require("./utils");
const { v4: uuidv4 } = require("uuid");

app.get("/get-neighboring-web-pages", async function (req, res) {
  const webPageURL = req.body.webPageURL;
  const options = req.body.options || {};

  const allAnchorHrefs = await webScrapper.scrapAnchorHrefs(
    webPageURL,
    options
  );

  res.status(200).json({ allAnchorHrefs });
});

const findInNodesByName = (name, nodes) => nodes.find((e) => e.name === name);

// returns the nodes and links appended to the graph sent with the request
app.post("/get-neighboring-web-pages-as-graph", async function (req, res) {
  const webPageURL = req.body.webPageURL;

  if (!webPageURL.match(utils.urlRegex)) {
    res.status(200).json({
      success: false,
      msg: utils.errorDictionary.badURL,
    });
    return;
  }

  const options = req.body.options || {};
  const currentGraph = req.body.currentGraph || { nodes: [], links: [] };
  const webPageName = utils.deriveWebPageName(String(webPageURL));

  // already visited
  const findInExistingGraph = findInNodesByName(
    webPageName,
    currentGraph.nodes
  );
  if (
    findInExistingGraph &&
    currentGraph.nodes.some((e) => e.source === findInExistingGraph.id)
  ) {
    res.status(200).json(currentGraph);
    return;
  }

  // run the web scrapper (time-costly)
  const allAnchorHrefs = await webScrapper.scrapAnchorHrefs(
    webPageURL,
    options
  );

  if (allAnchorHrefs.length === 0) {
    res.status(200).json({
      nodes: currentGraph.nodes,
      links: currentGraph.links,
      success: false,
      msg: utils.errorDictionary.deadEnd,
    });
    return;
  }

  if (allAnchorHrefs === -1) {
    res.status(200).json({
      nodes: currentGraph.nodes,
      links: currentGraph.links,
      success: false,
      msg: utils.errorDictionary.cantNavigate,
    });
    return;
  }

  // all outgoing hrefs and the web page itself
  const nodesToAppend = utils.uniqBy(
    [
      { url: webPageURL, name: webPageName, id: uuidv4() },
      ...allAnchorHrefs
        .map((url) => {
          const name = utils.deriveWebPageName(url);
          return findInNodesByName(name, currentGraph.nodes)
            ? { delete: true }
            : { delete: false, url, name, id: uuidv4() };
        })
        .filter((e) => !e.delete),
    ],
    (e) => e.name
  );

  // nodes of status quo graph plus the new web page plus all outgoing hrefs
  const nodes = utils.uniqBy(
    [
      ...currentGraph.nodes,
      ...nodesToAppend.map((e) => ({ url: e.url, name: e.name, id: e.id })),
    ],
    (e) => e.name
  );

  // get the complete object of the newly navigated web page
  const webPageInNodes = findInNodesByName(webPageName, nodes);

  // mathematical set intersection of old nodes and outgoing hrefs
  const newLinks = nodes.filter((value) =>
    nodesToAppend.some((e) => e.name === value.name)
  );

  // all new source-target tuples
  const linksToAppend = newLinks
    .filter((e) => e.name !== webPageName)
    .map((e) => ({
      source: webPageInNodes.id,
      target: e.id,
    }));

  const links = [...currentGraph.links, ...linksToAppend];

  // console.log("links", links);
  // console.log("nodes", nodes);

  res.status(200).json({
    nodes,
    links,
    success: true,
    msg: utils.errorDictionary.ok,
  });
  return;
});

app.listen(8000, "10.101.249.13");
