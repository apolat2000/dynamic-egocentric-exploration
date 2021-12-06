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
    res.status(200).json({ success: false, msg: "Bad webPageURL." });
    return;
  }

  const options = req.body.options || {};
  const currentGraph = req.body.currentGraph || { nodes: [], links: [] };
  const webPageName = utils.deriveWebPageName(String(webPageURL));
  console.log(webPageName);

  if (currentGraph.nodes.some((e) => e.name === webPageName)) {
    res.status(200).json(currentGraph);
    return;
  }

  // run the web scrapper (time-costly)
  const allAnchorHrefs = await webScrapper.scrapAnchorHrefs(
    webPageURL,
    options
  );

  const nodesToAppend = utils.uniqBy(
    await Promise.all(
      allAnchorHrefs
        .map(async (url) => {
          const name = await utils.deriveWebPageName(url);
          return findInNodesByName(name, currentGraph.nodes)
            ? { delete: true }
            : { delete: false, url, name, id: uuidv4() };
        })
        .filter((e) => !e.delete),
      { url: webPageURL, name: webPageName, id: uuidv4() }
    ),
    (e) => e.name
  );

  const nodes = [
    ...currentGraph.nodes,
    ...nodesToAppend.map((e) => ({ url: e.url, name: e.name, id: e.id })),
  ];

  const webPageInNodes = findInNodesByName(webPageName, nodes);

  const linksToAppend = nodesToAppend
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
    msg: "OK",
  });
  return;
});

app.listen(8000, "10.101.249.13");
