const frameGraphAttributeAppend =
  "node-auto-color-by: group; node-rel-size: 8; link-directional-arrow-length: 1.5; link-directional-arrow-rel-pos: 1; on-node-hover: node => hoverHandler(node); on-node-click: node => clickHandler(node)";

const urlRegex = new RegExp(
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
);

const explorationType = "free";
// const explorationType = "egoBubble";
// const explorationType = "egoHighlight";

export { frameGraphAttributeAppend, urlRegex, explorationType };
