import {
  hoverHandler,
  clickHandler,
  submitURLHandler,
  nodeObjectHandler,
  linkObjectHandler,
  moveForwards,
} from "./utils";
import {
  frameGraphAttributeAppend,
  cameraWasdAttributeAppend,
  cameraPositionAttributeAppend,
} from "./derived";
import {
  setLoading,
  setInVR,
  getInVR,
  setForwardMovementIntervalId,
  getForwardMovementIntervalId,
} from "./store/runtime";
import {
  getNodeSize,
  getExploratoryInterface,
  getLinkColor,
  getLinkOpacity,
  getDefaultURL,
  getIsShowingStats,
  getFOV,
  setExploratoryInterface,
  setIsShowingStats,
  setNodeSize,
  setLinkOpacity,
  setLinkColor,
  setFOV,
} from "./store/settings";

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

const showSettingsElement = document.getElementById("show-settings");
showSettingsElement.addEventListener("mousedown", function () {
  const settingsWrapper = document.getElementById("settings-wrapper");
  const currentDisplay = settingsWrapper.style.display;
  settingsWrapper.style.display = currentDisplay !== "none" ? "none" : "block";
  showSettingsElement.innerHTML =
    currentDisplay !== "none" ? "Show settings" : "Hide settings";
});

/* Setting defaults values for the settings form inputs*/
document.getElementById("starting-web-page-input").value = getDefaultURL();
document.getElementById("exploratory-interface").value = "free";
document.getElementById("default-url").value = "https://";
document.getElementById("link-color").value = getLinkColor();
document.getElementById("node-size").value = getNodeSize();
document.getElementById("link-opacity").value = getLinkOpacity();
document.getElementById("fov").value = getFOV();

// first URL input
document.getElementById("starting-web-page-submit").addEventListener(
  "click",
  function (e) {
    e.preventDefault();

    const eIValue = document.getElementById("exploratory-interface").value;
    setExploratoryInterface(eIValue);
    setIsShowingStats(document.getElementById("show-stats").checked);
    setNodeSize(document.getElementById("node-size").value);
    setLinkOpacity(document.getElementById("link-opacity").value);
    setLinkColor(document.getElementById("link-color").value);
    setFOV(document.getElementById("fov").value);

    scene.setAttribute("stats", eIValue);
    document
      .getElementById("forcegraph")
      .setAttribute("forcegraph", frameGraphAttributeAppend());
    document
      .getElementById("camera")
      .setAttribute("wasd-controls", cameraWasdAttributeAppend());
    document
      .getElementById("camera")
      .setAttribute("position", cameraPositionAttributeAppend());
    document.getElementById("camera").setAttribute("fov", getFOV());

    if (getExploratoryInterface() === "free")
      document
        .getElementById("a-frame-scene")
        .addEventListener("mousedown", function () {
          if (getInVR()) {
            if (getForwardMovementIntervalId())
              clearInterval(getForwardMovementIntervalId());
            const intervalId = setInterval(() => {
              moveForwards();
            }, 200);
            setForwardMovementIntervalId(intervalId);
          }
        });

    if (getExploratoryInterface() === "free")
      document
        .getElementById("a-frame-scene")
        .addEventListener("mouseup", () => {
          if (getExploratoryInterface() === "free")
            if (getInVR()) {
              clearInterval(getForwardMovementIntervalId());
              setForwardMovementIntervalId(null);
            }
        });

    if (getExploratoryInterface() === "free")
      document
        .getElementById("a-frame-scene")
        .addEventListener("touchstart", function () {
          if (getInVR()) {
            if (getForwardMovementIntervalId())
              clearInterval(getForwardMovementIntervalId());
            const intervalId = setInterval(() => {
              moveForwards();
            }, 200);
            setForwardMovementIntervalId(intervalId);
            console.log(intervalId);
          }
        });

    if (getExploratoryInterface() === "free")
      document
        .getElementById("a-frame-scene")
        .addEventListener("touchend", () => {
          if (getInVR()) {
            clearInterval(getForwardMovementIntervalId());
            setForwardMovementIntervalId(null);
          }
        });

    submitURLHandler();
  },
  false
);
