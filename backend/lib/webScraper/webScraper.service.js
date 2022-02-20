const puppeteer = require('puppeteer');

async function scrapAnchorHrefs(webPageURL, options) {
  try {
    // Initialize Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Specify page url
    await page.goto(webPageURL, { timeout: 15000 });
    console.log('page has been loaded!');

    // Evaluate/Compute the main task:
    const anchorElements = await page.evaluate(() => {
      const allAnchors = Array.from(document.querySelectorAll('a'));
      allHrefs = allAnchors.map((e) => e.href);
      return allHrefs;
    });
    console.log('Page has been evaluated!');

    // End Puppeteer
    browser.close();

    // Send response
    return anchorElements;
  } catch (error) {
    console.log(error);
    return -1;
  }
}

function findInNodesByName(name, nodes) {
  return nodes.find((e) => e.name === name);
}

function deriveWebPageName(URL) {
  const withoutPrefix = URL.replace('www.', '')
    .replace('https://', '')
    .replace('http://', '');

  const mainDomain = withoutPrefix.substring(
    0,
    withoutPrefix.concat('/').indexOf('/')
  );
  return mainDomain;
}

function countInArrayByName(inputArray, name) {
  return inputArray.reduce((n, x) => n + (x.name === name), 0);
}

function uniqueBy(inputArray, key) {
  let seen = new Set();
  return inputArray.filter((item) => {
    let k = key(item);
    return seen.has(k) ? false : seen.add(k);
  });
}

const urlRegex = new RegExp(
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
);

const errorDictionary = Object.freeze({
  notAllowed: 'notAllowed',
  badURL: 'badURL',
  badRequest: 'badRequest',
  ok: 'ok',
  somethingWentWrong: 'somethingWentWrong',
  cantNavigate: 'cantNavigate',
  deadEnd: 'deadEnd',
  alreadyVisited: 'alreadyVisited',
});

module.exports = {
  scrapAnchorHrefs,
  findInNodesByName,
  deriveWebPageName,
  countInArrayByName,
  uniqueBy,
  urlRegex,
  errorDictionary,
};
