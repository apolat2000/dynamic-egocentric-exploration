import {
  getNodeSize,
  getLinkColor,
  getLinkOpacity,
  getExploratoryInterface,
} from "./store/settings";

const nodeResolution = () => getNodeSize() * 2;

const linkWidth = () => (getExploratoryInterface() === "free" ? 0.8 : 0.5);

const arrowLength = () => (getExploratoryInterface() === "free" ? 6 : 0);

const frameGraphAttributeAppend = () => `num-dimensions: 3; link-curvature: ${
  getExploratoryInterface() === "free" ? "0.05" : "-0.5"
}; link-directional-arrow-length: ${arrowLength()}; link-color: ${getLinkColor()};
link-opacity: ${getLinkOpacity()}; node-auto-color-by: isBeingHovered; link-width: ${linkWidth()};
link-directional-arrow-rel-pos: 1; node-rel-size: ${getNodeSize()}; node-three-object: node => nodeObjectHandler(node);
link-three-object: link => linkObjectHandler(link);
node-resolution: ${nodeResolution()}; on-node-hover: node => hoverHandler(node);
on-node-click: node => clickHandler(node)`;

const cameraWasdAttributeAppend = () =>
  `${
    getExploratoryInterface() === "free"
      ? "fly: true; acceleration: 350;"
      : "enabled: false; fly: false"
  }`;

const cameraPositionAttributeAppend = () =>
  `${getExploratoryInterface() === "free" ? "0 20 50" : ""}`;

export {
  nodeResolution,
  linkWidth,
  arrowLength,
  frameGraphAttributeAppend,
  cameraWasdAttributeAppend,
  cameraPositionAttributeAppend,
};
