import { submitURLHandler, moveForwards } from "./utils";
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
  getFOV,
  setExploratoryInterface,
  setIsShowingStats,
  setNodeSize,
  setLinkOpacity,
  setLinkColor,
  setFOV,
} from "./store/settings";

import { initLocalStorage } from "./localStorage/init";
import { initStore } from "./store/init";
import {
  setLocalStorageExploratoryInterface,
  setLocalStorageDefaultURL,
  setLocalStorageIsShowingStats,
  setLocalStorageNodeSize,
  setLocalStorageLinkColor,
  setLocalStorageLinkOpacity,
  setLocalStorageFOV,
} from "./localStorage/controller";

setLoading(true);

/* get HTML elements which should be referenced and manipulated */
const startingWebPageInputElement = document.getElementById(
  "starting-web-page-input"
);
const showSettingsElement = document.getElementById("show-settings");
const exploratoryInterfaceElement = document.getElementById(
  "exploratory-interface"
);
const showStatsElement = document.getElementById("show-stats");
const defaultURLElement = document.getElementById("default-url");
const saveDefaultURLElement = document.getElementById("save-default-url");
const linkColorElement = document.getElementById("link-color");
const nodeSizeElement = document.getElementById("node-size");
const linkOpacityElement = document.getElementById("link-opacity");
const fovElement = document.getElementById("fov");
const sceneElement = document.getElementById("a-frame-scene");
const aText = document.getElementById("forcegraph-tooltip");
const settingsWrapper = document.getElementById("settings-wrapper");
const forcegraphElement = document.getElementById("forcegraph");
const cameraElement = document.getElementById("camera");
const submitButtonElement = document.getElementById("starting-web-page-submit");
const saveConfigurationButtonElement =
  document.getElementById("save-configuration");

// If the localStorage is empty, fill it with the very default values
initLocalStorage();
// If the localStorage was not empty, overwrite the default values with the data from localStorage
initStore();

/* Setting defaults values for the settings form inputs*/
startingWebPageInputElement.value = getDefaultURL();
exploratoryInterfaceElement.value = "free";
defaultURLElement.value = "https://";
linkColorElement.value = `0x${getLinkColor().toString(16)}`;
nodeSizeElement.value = getNodeSize();
linkOpacityElement.value = getLinkOpacity();
fovElement.value = getFOV();

/* Add event listeners */
sceneElement.addEventListener("enter-vr", function () {
  // when "0 - 25 -1", the text is not visible in VR (Android phone Firefox browser)
  aText.setAttribute("position", "0 -0.25 -3");
  setInVR(true);
});
sceneElement.addEventListener("exit-vr", function () {
  aText.setAttribute("position", "0 -0.25 -1");
  setInVR(false);
});
showSettingsElement.addEventListener("mousedown", function () {
  const currentDisplay = settingsWrapper.style.display;
  settingsWrapper.style.display = currentDisplay !== "none" ? "none" : "block";
  showSettingsElement.innerHTML =
    currentDisplay !== "none" ? "Show settings" : "Hide settings";
});
saveConfigurationButtonElement.addEventListener("click", function (e) {
  e.preventDefault();

  setLocalStorageExploratoryInterface(exploratoryInterfaceElement.value);
  setLocalStorageDefaultURL(defaultURLElement.value);
  setLocalStorageIsShowingStats(showStatsElement.checked);
  setLocalStorageNodeSize(nodeSizeElement.value);
  setLocalStorageLinkColor(Number(linkColorElement.value));
  setLocalStorageLinkOpacity(linkOpacityElement.value);
  setLocalStorageFOV(fovElement.value);
});
saveDefaultURLElement.addEventListener("click", function (e) {
  e.preventDefault();

  setLocalStorageDefaultURL(defaultURLElement.value);
  startingWebPageInputElement.value = defaultURLElement.value;
});
submitButtonElement.addEventListener(
  "click",
  async function (e) {
    e.preventDefault();

    const eIValue = exploratoryInterfaceElement.value;
    setExploratoryInterface(eIValue);
    setIsShowingStats(showStatsElement.checked);
    setNodeSize(nodeSizeElement.value);
    setLinkOpacity(linkOpacityElement.value);
    setLinkColor(linkColorElement.value);
    setFOV(document.getElementById("fov").value);

    sceneElement.setAttribute("stats", eIValue);
    forcegraphElement.setAttribute("forcegraph", frameGraphAttributeAppend());
    cameraElement.setAttribute("wasd-controls", cameraWasdAttributeAppend());
    cameraElement.setAttribute("position", cameraPositionAttributeAppend());
    cameraElement.setAttribute("fov", getFOV());

    if (getExploratoryInterface() === "free")
      sceneElement.addEventListener("mousedown", function () {
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
      sceneElement.addEventListener("mouseup", () => {
        if (getExploratoryInterface() === "free")
          if (getInVR()) {
            clearInterval(getForwardMovementIntervalId());
            setForwardMovementIntervalId(null);
          }
      });

    if (getExploratoryInterface() === "free")
      sceneElement.addEventListener("touchstart", function () {
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
      sceneElement.addEventListener("touchend", () => {
        if (getInVR()) {
          clearInterval(getForwardMovementIntervalId());
          setForwardMovementIntervalId(null);
        }
      });

    await submitURLHandler();
    setLoading(false);
  },
  false
);
