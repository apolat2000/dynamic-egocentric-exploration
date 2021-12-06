exports.findInNodesByName = (name, nodes) => nodes.find((e) => e.name === name);

exports.deriveWebPageName = (URL, options) => {
  const withoutPrefix = URL.replace("www.", "")
    .replace("https://", "")
    .replace("http://", "");

  const mainDomain = withoutPrefix.substring(
    0,
    withoutPrefix.concat("/").indexOf("/")
  );
  //   const withSubRoutes = withoutPrefix.replace("/", " ");
  return mainDomain;
};

exports.uniqBy = (inputArray, key) => {
  let seen = new Set();
  return inputArray.filter((item) => {
    let k = key(item);
    return seen.has(k) ? false : seen.add(k);
  });
};

exports.urlRegex = new RegExp(
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
);
