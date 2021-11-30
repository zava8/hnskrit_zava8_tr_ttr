import browser from "webextension-polyfill";

export default statusText => {
  let errorMessage = "";
  switch (statusText) {
    case "Network Error": errorMessage = browser.i18n.getMessage("networkerror"); break;
    case "Service Unavailable": errorMessage = browser.i18n.getMessage("unavailableerror"); break;
    default: errorMessage = `${browser.i18n.getMessage("unknownerror")} [${statusText}]`; break;
  }
  return errorMessage;
};
