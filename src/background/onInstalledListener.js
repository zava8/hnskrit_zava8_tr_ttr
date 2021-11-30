import browser from "webextension-polyfill";
import log from "loglevel";
import { initSettings, getSettings, setSettings } from "src/settings/settings";
import { initShortcuts } from "./keyboardShortcuts";

const logDir = "background/onInstalledListener";

const openOptionsPage = active => {
  browser.tabs.create({
    url: "options/index.html#information?action=updated",
    active: active
  });
};

export default async details => {
  if (details.reason != "install" && details.reason != "update") return;
  log.info(logDir, "onInstalledListener()", details);

  await initSettings();
  initShortcuts();

  const issho_OptionsPage = getSettings("issho_OptionsPagevhenUpdated");
  if (issho_OptionsPage) openOptionsPage(false);
  setSettings("issho_Updated", true);
};
