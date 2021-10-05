import React from "react";
import browser from "webextension-polyfill";
// import transliterator from "libindik-transliteration"

import getErrorMessage from "src/common/getErrorMessage";
import { getSettings } from "src/settings/settings";
import openUrl from "src/common/openUrl";
import transliterator from "src/common/transliterator"
import zabc_list_dict from "src/common/zabc"

import CopyButton from "./CopyButton";
import ListenButton from "./ListenButton";
import "../styles/ResultArea.scss";

const splitLine = text => {
  const regex = /(\n)/g;
  return text.split(regex).map((line, i) => (line.match(regex) ? <br key={i} /> : line));
};

export default props => {
  const { resultText } = props;
  var t = new transliterator();
  const ztrText = t.transliterate_indik_abc(resultText, zabc_list_dict);
  // const isError = statusText !== "OK";
  // const shouldShowCandidate = getSettings("ifShowCandidate");

  // const handleLinkClick = () => {
  //   const { inputText, targetLang } = props;
  //   const encodedText = encodeURIComponent(inputText);
  //   const translateUrl = `https://translate.google.com/?sl=auto&tl=${targetLang}&text=${encodedText}`;
  //   openUrl(translateUrl);
  // };

  return (
    <div id="ztrArea">
      <p>{splitLine(ztrText)}</p>
    </div>
  );
};
