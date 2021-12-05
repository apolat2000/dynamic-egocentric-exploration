// init express
const cors = require("cors");
const express = require("express");
const app = express();
app.use(cors());
app.options("*", cors());

// body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const webScrapper = require("./utils/webScrapper");

app.get("/get-neighboring-web-pages", async function (req, res) {
  const webPageUrl = req.body.webPageUrl;
  const options = req.body.options || {};

  const allAnchorHrefs = await webScrapper.scrapAnchorHrefs(
    webPageUrl,
    options
  );

  res.status(200).json({ allAnchorHrefs });
});

app.listen(8000);
