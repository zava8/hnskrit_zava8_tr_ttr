import browser from "webextension-polyfill";
const alphabeticallySort = (a, b) => a.name.localeCompare(b.name);

export default () => {
  const langlistText = browser.i18n.getMessage("langlist");
  const langlist = langlistText.split(", ");
  const langOptions = langlist.map(lang => ({ value: lang.split(":")[0], name: lang.split(":")[1] }));
  langOptions.sort(alphabeticallySort);
  return langOptions;
};
