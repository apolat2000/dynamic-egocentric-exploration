const explorationType = "free";
const isProduction = false;
// const explorationType = "egoBubble";
// const explorationType = "egoHighlight";

const nodeSize = 4;

const linkWidth = 1.5;
const linkColor = 0x000000;
const linkOpacity = 0.2;
const arrowLength = 5;

const frameGraphAttributeAppend = `num-dimensions: 3; link-curvature: ${
  explorationType === "free" ? "0.05" : "0"
}; link-directional-arrow-length: ${arrowLength}; link-color: ${linkColor};
link-opacity: ${linkOpacity}; node-auto-color-by: isBeingHovered; link-width: ${linkWidth};
link-directional-arrow-rel-pos: 1; node-rel-size: ${nodeSize}; node-three-object: node => nodeObjectHandler(node);
on-node-hover: node => hoverHandler(node); on-node-click: node => clickHandler(node)`;

const cameraWasdAttributeAppend = `${
  explorationType === "free" ? "fly: true; acceleration: 350;" : ""
}`;

const cameraPositionAttributeAppend = `${
  explorationType === "free" ? "0 20 50" : ""
}`;

const urlRegex = new RegExp(
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
);

const promptMessages = new Map();
promptMessages.set("loading", "Loading links coming out of #...");
promptMessages.set("cantNavigate", "# does not allow navigation.");
promptMessages.set("nothingNew", "Nothing new in #.");

export {
  explorationType,
  frameGraphAttributeAppend,
  cameraWasdAttributeAppend,
  cameraPositionAttributeAppend,
  urlRegex,
  promptMessages,
  nodeSize,
  isProduction,
};
