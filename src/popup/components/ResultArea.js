import React from "react";
import browser from "webextension-polyfill";
import getErrorMessage from "src/common/getErrorMessage";
import { getSettings } from "src/settings/settings";
import openUrl from "src/common/openUrl";
import CopyButton from "./CopyButton";
import ListenButton from "./ListenButton";
// import transliterator from "src/common/transliterator"
// import zabc_list_dict from "src/common/zabc"
import "../styles/ResultArea.scss";

const splitLine = text => {
  const regex = /(\n)/g;
  return text.split(regex).map((line, i) => (line.match(regex) ? <br key={i} /> : line));
};

export default props => {
  const { inputText, targetLang, langZtr, ztrText, candidateText, statusText } = props;
  const isError = statusText !== "OK";
  const shouldsho_Candidate = getSettings("ifsho_Candidate");
  // var t = new transliterator();
  // function ttrdom() {t.transliterate_elem_content(document.body);}
  const handleLinkClick = () => {
    const { inputText, targetLang } = props;
    const encodedText = encodeURIComponent(inputText);
    const translateUrl = `https://translate.google.com/?sl=auto&tl=${targetLang}&text=${encodedText}`;
    openUrl(translateUrl);
    let [tab] = chrome.tabs.query({ active: true, currentWindow: true });
    // chrome.scripting.executeScript({ target: { tabId: tab.id }, function: ttrdom });
  };

  return (
    <div id="resultArea">
      <p className="resultText" dir="auto">{splitLine(ztrText)}</p>
      {shouldsho_Candidate && <p className="candidateText" dir="auto">{splitLine(candidateText)}</p>}
      {isError && <p className="error">{getErrorMessage(statusText)}</p>}
      {isError && (
        <p className="translateLink">
          <a onClick={handleLinkClick}>{browser.i18n.getMessage("open_in_google_label")}</a>
        </p>
      )}
      <div className="mediaButtons"> <CopyButton text={ztrText} /> <ListenButton text={ztrText} lang="en" /> </div>
    </div>
  );
};
