const getLocalStorageExploratoryInterface = () =>
  JSON.parse(localStorage.getItem("exploratoryInterface"));
const getLocalStorageDefaultURL = () =>
  JSON.parse(localStorage.getItem("defaultURL"));
const getLocalStorageIsShowingStats = () =>
  JSON.parse(localStorage.getItem("isShowingStats"));
const getLocalStorageNodeSize = () =>
  JSON.parse(localStorage.getItem("nodeSize"));
const getLocalStorageLinkColor = () =>
  JSON.parse(localStorage.getItem("linkColor"));
const getLocalStorageLinkOpacity = () =>
  JSON.parse(localStorage.getItem("linkOpacity"));

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

export {
  getLocalStorageExploratoryInterface,
  getLocalStorageDefaultURL,
  getLocalStorageIsShowingStats,
  getLocalStorageNodeSize,
  getLocalStorageLinkColor,
  getLocalStorageLinkOpacity,
  setLocalStorageExploratoryInterface,
  setLocalStorageDefaultURL,
  setLocalStorageIsShowingStats,
  setLocalStorageNodeSize,
  setLocalStorageLinkColor,
  setLocalStorageLinkOpacity,
};
