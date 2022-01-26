const getLocalStorageExploratoryInterface = () =>
  localStorage.getItem("exploratoryInterface");
const getLocalStorageDefaultURL = () => localStorage.getItem("defaultURL");
const getLocalStorageIsShowingStats = () =>
  localStorage.getItem("isShowingStats") === "true";
const getLocalStorageNodeSize = () =>
  parseInt(localStorage.getItem("nodeSize"), 10);
const getLocalStorageLinkColor = () => localStorage.getItem("linkColor");
const getLocalStorageLinkOpacity = () =>
  parseInt(localStorage.getItem("linkOpacity"));
const getLocalStorageFOV = () => parseInt(localStorage.getItem("fov"));

const setLocalStorageExploratoryInterface = (payload) => {
  if (["free", "egoHighlight"].includes(payload))
    localStorage.setItem("exploratoryInterface", payload);
};
const setLocalStorageDefaultURL = (payload) => {
  localStorage.setItem("defaultURL", payload);
};
const setLocalStorageIsShowingStats = (payload) => {
  localStorage.setItem("isShowingStats", payload);
};
const setLocalStorageNodeSize = (payload) => {
  localStorage.setItem("nodeSize", payload);
};
const setLocalStorageLinkColor = (payload) => {
  localStorage.setItem("linkColor", payload);
};
const setLocalStorageLinkOpacity = (payload) => {
  localStorage.setItem("linkOpacity", payload);
};
const setLocalStorageFOV = (payload) => {
  localStorage.setItem("fov", payload);
};

export {
  getLocalStorageExploratoryInterface,
  getLocalStorageDefaultURL,
  getLocalStorageIsShowingStats,
  getLocalStorageNodeSize,
  getLocalStorageLinkColor,
  getLocalStorageLinkOpacity,
  getLocalStorageFOV,
  setLocalStorageExploratoryInterface,
  setLocalStorageDefaultURL,
  setLocalStorageIsShowingStats,
  setLocalStorageNodeSize,
  setLocalStorageLinkColor,
  setLocalStorageLinkOpacity,
  setLocalStorageFOV,
};
