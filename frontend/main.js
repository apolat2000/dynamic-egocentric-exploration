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

const moveTowardsDirection = () => {
  const camera = document.getElementById("camera");
  const rig = document.getElementById("rig");
  const pos = new THREE.Vector3();
  const { x, y, z } = pos.setFromMatrixPosition(camera.object3D.matrixWorld);
  const rot = camera.getAttribute("rotation");
  rig.setAttribute(
    "animation",
    `property: position; dur: 200; to: ${x - rot.y / 10} ${
      y + rot.x / 10
    } ${z}; easing: linear;`
  );
  setTimeout(() => {
    rig.setAttribute("position", `${x - rot.y / 10} ${y + rot.x / 10} ${z}`);
  }, 200);
};

document
  .getElementById("a-frame-scene")
  .addEventListener("mousedown", function () {
    if (getInVR()) {
      clearInterval(getVrMovementIntervalId());
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
    getVrMovementIntervalId(null);
    console.log("cleared");
  }
});

document
  .getElementById("a-frame-scene")
  .addEventListener("touchstart", function () {
    if (getInVR()) {
      clearInterval(getVrMovementIntervalId());
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
    getVrMovementIntervalId(null);
    console.log("cleared");
  }
});

document.getElementById("starting-web-page-input").value = defaultURL;
