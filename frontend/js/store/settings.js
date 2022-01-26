let exploratoryInterface = "free";
let defaultURL = "https://moodle.rwth-aachen.de/";
let isShowingStats = false;

let nodeSize = 4;
let linkColor = 16777215;
let linkOpacity = 0.2;

let fov = 80;

const setExploratoryInterface = (payload) => {
  exploratoryInterface = payload;
};
const getExploratoryInterface = () => exploratoryInterface;

const setDefaultURL = (payload) => {
  defaultURL = payload;
};
const getDefaultURL = () => defaultURL;

const setIsShowingStats = (payload) => {
  isShowingStats = payload;
};
const getIsShowingStats = () => isShowingStats;

const setNodeSize = (payload) => {
  nodeSize = payload;
};
const getNodeSize = () => nodeSize;

const setLinkColor = (payload) => {
  if (typeof payload === "number") {
    linkColor = payload;
    return;
  }
  if (typeof payload === "string") linkColor = Number(payload);
};

const getLinkColor = () => linkColor;

const setLinkOpacity = (payload) => {
  linkOpacity = payload;
};
const getLinkOpacity = () => linkOpacity;

const setFOV = (payload) => {
  fov = payload;
};
const getFOV = () => fov;

export {
  setExploratoryInterface,
  getExploratoryInterface,
  setDefaultURL,
  getDefaultURL,
  setIsShowingStats,
  getIsShowingStats,
  setNodeSize,
  getNodeSize,
  setLinkColor,
  getLinkColor,
  setLinkOpacity,
  getLinkOpacity,
  setFOV,
  getFOV,
};
