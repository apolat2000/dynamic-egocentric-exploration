import {
  hoverHandler,
  clickHandler,
  submitURLHandler,
  nodeObjectHandler,
  linkObjectHandler,
} from "./utils";
import {
  explorationType,
  frameGraphAttributeAppend,
  cameraWasdAttributeAppend,
  cameraPositionAttributeAppend,
  isProduction,
  defaultURL,
} from "./constants";
import { setLoading, setInVR } from "./state";

/* INIT */
setLoading(false);

// expose globally
window.clickHandler = clickHandler;
window.hoverHandler = hoverHandler;
window.nodeObjectHandler = nodeObjectHandler;
window.linkObjectHandler = linkObjectHandler;

const scene = document.getElementById("a-frame-scene");

scene.addEventListener("enter-vr", function () {
  const aText = document.getElementById("forcegraph-tooltip");
  aText.setAttribute("position", "0 -0.25 -2");
  aText.setAttribute("width", 1.5);
  setInVR(true);
});
scene.addEventListener("exit-vr", function () {
  const aText = document.getElementById("forcegraph-tooltip");
  aText.setAttribute("position", "0 -0.25 -1");
  aText.setAttribute("width", 2);
  setInVR(false);
});

if (isProduction) scene.setAttribute("stats", true);

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

document.getElementById("starting-web-page-input").value = defaultURL;
