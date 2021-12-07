const explorationType = "free";
// const explorationType = "egoBubble";
// const explorationType = "egoHighlight";

const nodeSize = 8;

const frameGraphAttributeAppend = `node-auto-color-by: group; link-curvature: ${
  explorationType === "free" ? "0.05" : "0"
}; link-directional-arrow-length: 1.5; node-rel-size: ${nodeSize}; node-auto-color-by: isBeingHovered; link-directional-arrow-rel-pos: 1; node-three-object: node => nodeObjectHandler(node); on-node-hover: node => hoverHandler(node); on-node-click: node => clickHandler(node)`;

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
};
