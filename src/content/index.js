import React from "react";
import ReactDOM from "react-dom";
import browser from "webextension-polyfill";
import { initSettings, getSettings, handleSettingsChange } from "src/settings/settings";
import { updateLogLevel, overWriteLogLevel } from "src/common/log";
import TranslateContainer from "./components/TranslateContainer";
/////////
import transliterator from 'kvz-transliteration';
// import transliterator from 'src/common/transliterator.js'
// import Tooltip from './tooltip.js';
// import unicodehindi_to_ascii_dict from 'src/common/unicodehindi_to_ascii_dict.js';
// import '../styles/contentStyle.scss';
/////////
// import './veb8fonts.css'
/////////
const init = async () => {
  await initSettings();
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("keydown", handleKeyDown);
  window.addEventListener("unload", onUnload, { once: true });
  browser.storage.onChanged.addListener(handleSettingsChange);
  browser.runtime.onMessage.addListener(handleMessage);
  overWriteLogLevel();
  updateLogLevel();
  disableExtensionByUrlList();
};
init();

let prevSelectedText = "";
let t = null, transliterated_webpage = false, observer = null, overlay = false;
const handleMouseUp = async e => {
  await waitTime(10);

  const isLeftClick = e.button === 0;
  if (!isLeftClick) return;

  const isInPasswordField = e.target.tagName === "INPUT" && e.target.type === "password";
  if (isInPasswordField) return;

  const inCodeElement = e.target.tagName === "CODE" || !!e.target.closest("code");
  if (inCodeElement && getSettings("isDisabledInCodeElement")) return;

  const isInThisElement =
    document.querySelector("#hnskrit") &&
    document.querySelector("#hnskrit").contains(e.target);
  if (isInThisElement) return;

  removeTranslatecontainer();

  const ignoredDocumentLang = getSettings("ignoredDocumentLang").split(",").map(s => s.trim()).filter(s => !!s);
  if (ignoredDocumentLang.length) {
    const ignoredLangSelector = ignoredDocumentLang.map(lang => `[lang="${lang}"]`).join(',')
    if (!!e.target.closest(ignoredLangSelector)) return;
  }

  const selectedText = getSelectedText();
  prevSelectedText = selectedText;
  if (selectedText.length === 0) return;
  if (getSettings("isDisabledInTextFields")) { if (isInContentEditable()) return; }
  if (getSettings("ifOnlyTranslateWhenModifierKeyPressed")) {
    const modifierKey = getSettings("modifierKey");
    switch (modifierKey) {
      case "shift": if (!e.shiftKey) return; break;
      case "alt": if (!e.altKey) return; break;
      case "ctrl": if (!e.ctrlKey) return; break;
      case "cmd": if (!e.metaKey) return; break;
      default: break;
    }
  }
  const clickedPosition = { x: e.clientX, y: e.clientY };
  const selectedPosition = getSelectedPosition();
  showTranslateContainer(selectedText, selectedPosition, clickedPosition);
};

const waitTime = time => { return new Promise(resolve => setTimeout(() => resolve(), time)); };
const getSelectedText = () => {
  const element = document.activeElement;
  const isInTextField = element.tagName === "INPUT" || element.tagName === "TEXTAREA";
  const selectedText = isInTextField ? element.value.substring(element.selectionStart, element.selectionEnd) : window.getSelection().toString();
  return selectedText;
};

const getSelectedPosition = () => {
  const element = document.activeElement;
  const isInTextField = element.tagName === "INPUT" || element.tagName === "TEXTAREA";
  const selectedRect = isInTextField ? element.getBoundingClientRect() : window .getSelection() .getRangeAt(0) .getBoundingClientRect();
  let selectedPosition;
  const panelReferencePoint = getSettings("panelReferencePoint");
  switch (panelReferencePoint) {
    case "topSelectedText": selectedPosition = { x: selectedRect.left + selectedRect.width / 2, y: selectedRect.top }; break;
    case "bottomSelectedText":
    default: selectedPosition = { x: selectedRect.left + selectedRect.width / 2, y: selectedRect.bottom }; break;
  }
  return selectedPosition;
};
const isInContentEditable = () => {
  const element = document.activeElement;
  if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") return true;
  if (element.contentEditable === "true") return true;
  return false;
};
const handleKeyDown = e => { if (e.key === "Escape") { removeTranslatecontainer(); } };
const onUnload = () => { browser.storage.onChanged.removeListener(handleSettingsChange); };
let isEnabled = true;
const handleMessage = async request => {
  const empty = new Promise(resolve => { setTimeout(() => { return resolve(""); }, 100); });  
  console.log("in index.js:handleMessage : request.message is " + request.message);
  switch (request.message) {
      case "0": case "1": case "2": case "3":
        console.log("in content/index.js:handleMessage: calling transliterate_webpage( " + request.message + " )");
        transliterate_webpage(request.message);
        break;
      case "utr":
        console.log("in content/index.js:handleMessage: case utr calling utransliterate_webpage()");
        utransliterate_webpage();
        break;
      case "getTabUrl": if (!isEnabled) return empty; if (window == window.parent) return location.href; else return empty;
      case "getSelectedText":
        if (!isEnabled) return empty;
        if (prevSelectedText.length === 0) return empty;
        else return prevSelectedText;
      case "translateSelectedText": {
        if (!isEnabled) return empty;
        const selectedText = getSelectedText();
        if (selectedText.length === 0) return;
        const selectedPosition = getSelectedPosition();
        removeTranslatecontainer();
        showTranslateContainer(selectedText, selectedPosition, null, true);
        break;
      }
      case "getEnabled": return isEnabled;
      case "enableExtension": isEnabled = true; break;
      case "disableExtension": removeTranslatecontainer(); isEnabled = false; break;
      default: return empty;
  }
};

const disableExtensionByUrlList = () => {
  const disableUrls = getSettings("disableUrlList").split("\n");
  let pageUrl;
  try { pageUrl = top.location.href; } catch (e) { pageUrl = document.referrer; }

  const matchesPageUrl = urlPattern => {
    const pattern = urlPattern
      .trim()
      .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, match => (match === "*" ? ".*" : "\\" + match));
    if (pattern === "") return false;
    return RegExp("^" + pattern + "$").test(pageUrl);
  };

  const isMatched = disableUrls.some(matchesPageUrl);
  if (isMatched) isEnabled = false;
};

const removeTranslatecontainer = async () => { const element = document.getElementById("hnskrit"); if (!element) return;
  ReactDOM.unmountComponentAtNode(element);
  element.parentNode.removeChild(element);
};

const showTranslateContainer = ( selectedText, selectedPosition, clickedPosition = null, shouldTranslate = false ) => {
  const element = document.getElementById("hnskrit"); if (element) return; if (!isEnabled) return;
  document.body.insertAdjacentHTML("beforeend", "<div id='hnskrit'></div>");
  ReactDOM.render( <TranslateContainer
      removeContainer={removeTranslatecontainer} selectedText={selectedText}
      selectedPosition={selectedPosition} clickedPosition={clickedPosition}
      shouldTranslate={shouldTranslate}
    />, document.getElementById("hnskrit") );
};

function transliterate_webpage(ztr_dir_string) {
  if(!(t)) t = new transliterator();
  t.transliterate_dom_node(document.body, ztr_dir_string);
  transliterated_webpage = true;
}
function utransliterate_webpage() {
  if(!(t)) t = new transliterator();
  t.untransliterate_dom_node();
  transliterated_webpage = false;
}
