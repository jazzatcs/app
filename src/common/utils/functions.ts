import Extension from "@contentstack/app-sdk/dist/src/extension";
import { get, isEmpty, keys } from "lodash";
import { TypePopupWindowDetails } from "../types/types";

function getAppLocation(sdk: Extension): string {
  const locations = keys(sdk?.location);
  let locationName = "";
  for (let i = 0; i <= locations.length; i++) {
    if (!isEmpty(get(sdk, `location.${locations[i]}`, undefined))) {
      locationName = locations[i];
      break;
    }
  }
  return locationName;
}


const popupWindow = (windowDetails: TypePopupWindowDetails) => {
  const left = window.screen.width / 2 - windowDetails.w / 2;
  const top = window.screen.height / 2 - windowDetails.h / 2;
  return window.open(
    windowDetails.url,
    windowDetails.title,
    "toolbar=no, location=no, directories=no, " +
      "status=no, menubar=no, scrollbars=no, resizable=no, " +
      `copyhistory=no, width=${windowDetails.w}, ` +
      `height=${windowDetails.h}, ` +
      `top=${top}, left=${left}`
  );
};


const handleConfigtoSelectorPage = (config: any, contentTypeConfig: any) => {
  if (!Object.keys(contentTypeConfig)?.length) return config;

  return {
    cloudName: contentTypeConfig?.cloudName || config?.cloudName,
    apiKey: contentTypeConfig?.apiKey || config?.apiKey,
  };
};

// function to filter unique assets of array based on "iteratee"
const uniqBy = (arr: any[], iteratee: any) => {
  if (typeof iteratee === "string") {
    const prop = iteratee;
    iteratee = (item: any) => item?.[prop];
  }

  return arr?.filter(
    (x, i, self) =>
      i === self?.findIndex((y) => iteratee(x) === iteratee(y)) && x !== null
  );
};

const utils = {
  getAppLocation,
  popupWindow,
  handleConfigtoSelectorPage,
  uniqBy

};



export default utils;
