const explorationType = "egoHighlight";
// const explorationType = "free";

const isProduction = false;

// const defaultURL = "https://apolat2000.github.io/";
// const defaultURL = "https://moodle.rwth-aachen.de/";
// const defaultURL = "https://www.instagram.com/astarwth/?hl=en";
// const defaultURL = "https://www.aachen.de/";
// const defaultURL =
//   "https://www.google.com/search?client=firefox-b-d&q=network+socket"; // 12 outgoing links
// const defaultURL = "https://en.wikipedia.org/wiki/Network_socket"; // 52 outgoing links

const defaultURL =
  "https://www.google.com/search?client=firefox-b-d&q=scripttaal+nl+wiki"; //(13) "https://nl.wikipedia.org/wiki/Scripttaal"(57)

// const defaultURL =
//   "https://www.google.com/search?client=firefox-b-d&q=fatih+nederlands"; //(12) "https://nl.wikipedia.org/wiki/Fatih" (55)

const nodeSize = 4;
const nodeResolution = nodeSize * 2;

const linkWidth = explorationType === "free" ? 0.8 : 0.5;
const linkColor = 0xffffff;
const linkOpacity = 0.2;

const arrowLength = explorationType === "free" ? 6 : 0;

const frameGraphAttributeAppend = `num-dimensions: 3; link-curvature: ${
  explorationType === "free" ? "0.05" : "-0.5"
}; link-directional-arrow-length: ${arrowLength}; link-color: ${linkColor};
link-opacity: ${linkOpacity}; node-auto-color-by: isBeingHovered; link-width: ${linkWidth};
link-directional-arrow-rel-pos: 1; node-rel-size: ${nodeSize}; node-three-object: node => nodeObjectHandler(node);
link-three-object: link => linkObjectHandler(link);
node-resolution: ${nodeResolution}; on-node-hover: node => hoverHandler(node);
on-node-click: node => clickHandler(node)`;

const cameraWasdAttributeAppend = `${
  explorationType === "free"
    ? "fly: true; acceleration: 350;"
    : "enabled: false; fly: false"
}`;

const cameraPositionAttributeAppend = `${
  explorationType === "free" ? "0 20 50" : ""
}`;

const urlRegex = new RegExp(
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
);

const promptMessages = new Map();
promptMessages.set("loading", "Loading links from #...");
promptMessages.set("cantNavigate", "# does not allow navigation.");
promptMessages.set("nothingNew", "Nothing new in #.");
promptMessages.set("deadEnd", "# is a dead end.");

export {
  explorationType,
  frameGraphAttributeAppend,
  cameraWasdAttributeAppend,
  cameraPositionAttributeAppend,
  urlRegex,
  promptMessages,
  nodeSize,
  nodeResolution,
  linkWidth,
  linkColor,
  linkOpacity,
  isProduction,
  defaultURL,
};
