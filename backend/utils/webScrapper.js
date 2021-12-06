// web scrapper
const puppeteer = require("puppeteer");

exports.scrapAnchorHrefs = async (webPageURL, options) => {
  try {
    // Initialize Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Specify page url
    await page.goto(webPageURL);
    console.log("page has been loaded!");

    // Evaluate/Compute the main task:
    const anchorElements = await page.evaluate(() => {
      const allAnchors = Array.from(document.querySelectorAll("a"));
      allHrefs = allAnchors.map((e) => e.href);
      return allHrefs;
    });
    console.log("Page has been evaluated!");

    // End Puppeteer
    await browser.close();

    // Send response
    return anchorElements;
  } catch (error) {
    console.log(error);
    return error;
  }
};

exports.deriveWebPageName = async (webPageURL, options) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(webPageURL);
    const title = await page.title();
    await browser.close();
    return title;
  } catch (error) {
    return error;
  }
};
