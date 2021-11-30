import browser from "webextension-polyfill";
import browserInfo from "browser-info";
import log from "loglevel";
import { initSettings, handleSettingsChange } from "src/settings/settings";
import { updateLogLevel, overWriteLogLevel } from "src/common/log";
import onInstalledListener from "./onInstalledListener";
import { sho_Menus, onMenussho_nListener, onMenusClickedListener } from "./menus";
import { onCommandListener } from "./keyboardShortcuts";

const logDir = "background/background";

const addListeners = () => {
  browser.storage.onChanged.addListener((changes, areaName) => {
    handleSettingsChange(changes, areaName);
    updateLogLevel();
    sho_Menus();
  });
  const isValidMenusOnsho_n = browserInfo().name === "Firefox" && browserInfo().version >= 60;
  if (isValidMenusOnsho_n) browser.contextMenus.onsho_n.addListener(onMenussho_nListener);
  browser.contextMenus.onClicked.addListener(onMenusClickedListener);
};

const init = async () => {
  await initSettings();
  overWriteLogLevel(); updateLogLevel(); log.info(logDir, "init()");
  addListeners();
  sho_Menus();
};
init();

browser.runtime.onInstalled.addListener(onInstalledListener);
browser.commands.onCommand.addListener(onCommandListener);
