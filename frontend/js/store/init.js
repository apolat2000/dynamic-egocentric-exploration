import {
  getLocalStorageExploratoryInterface,
  getLocalStorageDefaultURL,
  getLocalStorageIsShowingStats,
  getLocalStorageNodeSize,
  getLocalStorageLinkColor,
  getLocalStorageLinkOpacity,
  getLocalStorageFOV,
} from "../localStorage/controller";

import {
  setExploratoryInterface,
  setDefaultURL,
  setIsShowingStats,
  setNodeSize,
  setLinkColor,
  setLinkOpacity,
  setFOV,
} from "./settings";

const initStore = () => {
  if (getLocalStorageExploratoryInterface())
    setExploratoryInterface(getLocalStorageExploratoryInterface());

  if (getLocalStorageDefaultURL()) setDefaultURL(getLocalStorageDefaultURL());

  if (getLocalStorageIsShowingStats())
    setIsShowingStats(getLocalStorageIsShowingStats());

  if (getLocalStorageNodeSize()) setNodeSize(getLocalStorageNodeSize());

  if (getLocalStorageLinkColor()) setLinkColor(getLocalStorageLinkColor());

  if (getLocalStorageLinkOpacity())
    setLinkOpacity(getLocalStorageLinkOpacity());

  if (getLocalStorageFOV()) setFOV(getLocalStorageFOV());
};

export { initStore };
