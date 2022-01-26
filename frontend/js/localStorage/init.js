import {
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
} from "./controller";

import {
  getExploratoryInterface,
  getDefaultURL,
  getIsShowingStats,
  getNodeSize,
  getLinkColor,
  getLinkOpacity,
  getFOV,
} from "../store/settings";

const initLocalStorage = () => {
  if (!getLocalStorageExploratoryInterface())
    setLocalStorageExploratoryInterface(getExploratoryInterface());

  if (!getLocalStorageDefaultURL()) setLocalStorageDefaultURL(getDefaultURL());

  if (!getLocalStorageIsShowingStats())
    setLocalStorageIsShowingStats(getIsShowingStats());

  if (!getLocalStorageNodeSize()) setLocalStorageNodeSize(getNodeSize());

  if (!getLocalStorageLinkColor()) setLocalStorageLinkColor(getLinkColor());

  if (!getLocalStorageLinkOpacity())
    setLocalStorageLinkOpacity(getLinkOpacity());

  if (!getLocalStorageFOV()) setLocalStorageFOV(getFOV());
};

export { initLocalStorage };
