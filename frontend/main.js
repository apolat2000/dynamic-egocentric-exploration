import {
  hoverHandler,
  clickHandler,
  submitURLHandler,
  nodeObjectHandler,
} from "./utils";
import {
  frameGraphAttributeAppend,
  cameraWasdAttributeAppend,
  cameraPositionAttributeAppend,
} from "./constants";
import { setLoading } from "./state";

/* INIT */
setLoading(false);

// expose globally
window.clickHandler = clickHandler;
window.hoverHandler = hoverHandler;
window.nodeObjectHandler = nodeObjectHandler;

document
  .getElementById("forcegraph")
  .setAttribute("forcegraph", frameGraphAttributeAppend);

document
  .getElementById("camera")
  .setAttribute("wasd-controls", cameraWasdAttributeAppend);

document
  .getElementById("camera")
  .setAttribute("position", cameraPositionAttributeAppend);

// first URL input
document
  .getElementById("starting-web-page-submit")
  .addEventListener("click", submitURLHandler, false);
