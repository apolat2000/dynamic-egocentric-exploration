import {
  hoverHandler,
  clickHandler,
  submitURLHandler,
  nodeObjectHandler,
  linkObjectHandler,
  moveTowardsDirection,
} from "./utils";
import {
  explorationType,
  frameGraphAttributeAppend,
  cameraWasdAttributeAppend,
  cameraPositionAttributeAppend,
  isProduction,
  defaultURL,
} from "./constants";
import {
  setLoading,
  setInVR,
  getInVR,
  setVrMovementIntervalId,
  getVrMovementIntervalId,
} from "./state";

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
  // when "0 - 25 -1", the text is not visible in VR (Android phone Firefox browser)
  aText.setAttribute("position", "0 -0.25 -3");

  setInVR(true);
});
scene.addEventListener("exit-vr", function () {
  const aText = document.getElementById("forcegraph-tooltip");
  aText.setAttribute("position", "0 -0.25 -1");

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

document
  .getElementById("a-frame-scene")
  .addEventListener("mousedown", function () {
    if (getInVR()) {
      if (getVrMovementIntervalId()) clearInterval(getVrMovementIntervalId());
      const intervalId = setInterval(() => {
        moveTowardsDirection();
      }, 200);
      setVrMovementIntervalId(intervalId);
      console.log(intervalId);
    }
  });

document.getElementById("a-frame-scene").addEventListener("mouseup", () => {
  if (getInVR()) {
    clearInterval(getVrMovementIntervalId());
    setVrMovementIntervalId(null);
  }
});

document
  .getElementById("a-frame-scene")
  .addEventListener("touchstart", function () {
    if (getInVR()) {
      if (getVrMovementIntervalId()) clearInterval(getVrMovementIntervalId());
      const intervalId = setInterval(() => {
        moveTowardsDirection();
      }, 200);
      setVrMovementIntervalId(intervalId);
      console.log(intervalId);
    }
  });

document.getElementById("a-frame-scene").addEventListener("touchend", () => {
  if (getInVR()) {
    clearInterval(getVrMovementIntervalId());
    setVrMovementIntervalId(null);
  }
});

document.getElementById("starting-web-page-input").value = defaultURL;
