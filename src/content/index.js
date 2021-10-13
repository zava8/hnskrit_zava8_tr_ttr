import React from "react";
import ReactDOM from "react-dom";
import browser from "webextension-polyfill";
import { initSettings, getSettings, handleSettingsChange } from "src/settings/settings";
import { updateLogLevel, overWriteLogLevel } from "src/common/log";
import TranslateContainer from "./components/TranslateContainer";
/////////
// import browser from 'webextension-polyfill';
import transliterator from './transliterator.js'
// import Tooltip from './tooltip.js';
import unicodehindi_to_ascii_dict from './unicodehindi_to_ascii_dict.js';
// import '../styles/contentStyle.scss';
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
    document.querySelector("#simple-translate") &&
    document.querySelector("#simple-translate").contains(e.target);
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
      case "abc5":
        console.log("in index.js:handleMessage: case abc5 calling transliterate_webpage(abc5)");
        transliterate_webpage("abc5");
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

const removeTranslatecontainer = async () => { const element = document.getElementById("simple-translate"); if (!element) return;
  ReactDOM.unmountComponentAtNode(element);
  element.parentNode.removeChild(element);
};

const showTranslateContainer = ( selectedText, selectedPosition, clickedPosition = null, shouldTranslate = false ) => {
  const element = document.getElementById("simple-translate"); if (element) return; if (!isEnabled) return;
  document.body.insertAdjacentHTML("beforeend", "<div id='simple-translate'></div>");
  ReactDOM.render( <TranslateContainer
      removeContainer={removeTranslatecontainer} selectedText={selectedText}
      selectedPosition={selectedPosition} clickedPosition={clickedPosition}
      shouldTranslate={shouldTranslate}
    />, document.getElementById("simple-translate") );
};

//////////////


function transliterate_input(input,tr_selected_val) {
  switch(tr_selected_val) {
    case "abc5" : 
      console.log(" in index.js: transliterate_input case abc5: calling t.transliterate_unicodehindi_to_ascii");
      return t.transliterate_unicodehindi_to_ascii(input, unicodehindi_to_ascii_dict);
  }
  // if (0 < tr_selected_indeks && 0xC > tr_selected_indeks)
  //   { return t.transliterate_unicodehindi_to_ascii(input, unicodehindi_to_ascii_dict); }
  // if (0 === tr_selected_indeks) { return t.transliterate_ascii_to_asciismall(input); }
}
function transliterate_elem_content(elem, tr_selected_val) {
  var nods_dikt_list = [], text = "", nekst_node,
    nodeIterator = elem.ownerDocument.createNodeIterator( elem, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
          if (node.parentNode && node.parentNode.nodeName !== 'SCRIPT') { return NodeFilter.FILTER_ACCEPT; }
        }
      },
      false
    );
  while (nekst_node = nodeIterator.nextNode()) {
    nods_dikt_list.push({ tekstNode: nekst_node, start: text.length });
    text += nekst_node.nodeValue;
  }
  if (!nods_dikt_list.length) return;
  var nekst_nod_dikt;
  for (var i = 0; i < nods_dikt_list.length; ++i) { nekst_nod_dikt = nods_dikt_list[i];
    var spanNode = document.createElement("span");
    spanNode.className = "ztred";
    spanNode.dataset.oldtekst = nekst_nod_dikt.tekstNode.textContent;
    nekst_nod_dikt.tekstNode.parentNode.replaceChild(spanNode, nekst_nod_dikt.tekstNode);
    spanNode.appendChild(nekst_nod_dikt.tekstNode);
  }
  var ztred_span_list = elem.getElementsByClassName('ztred');
  var nekst_ztred_span;
  for (var i = 0; i < ztred_span_list.length; ++i)
  {
    nekst_ztred_span = ztred_span_list[i];
    nekst_ztred_span.textContent = transliterate_input(nekst_ztred_span.textContent,tr_selected_val);
  }
}
// function untransliterate_webpage() {
//   Tooltip.destroy();
//   if (observer) observer.disconnect();
//   var ztred_span_list = document.getElementsByClassName('ztred');
//   var nekst_ztred_span;
//   for (let i = 0;i < ztred_span_list.length;i++) {
//     nekst_ztred_span = ztred_span_list[i];
//     var span_oldtekst = nekst_ztred_span.dataset.oldtekst ;
//     if (!span_oldtekst.startsWith("\n")) { nekst_ztred_span.innerText = span_oldtekst; }   
//   }
//   transliterated_webpage = false;
// }
/** * Thanks Michael Zaporozhets * https://stackoverflow.com/a/11381730 */
function detectMob() {
  const toMatch = [ /Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i ];
  return toMatch.some((toMatchItem) => { return navigator.userAgent.match(toMatchItem); });
}
function transliterate_webpage(tr_selected_val) {
  console.log("in index.js transliterate_webpage called vith tr_selected_val :  " + tr_selected_val );
  t = new transliterator();
  transliterate_elem_content(document.body, tr_selected_val);
  // if (overlay && !detectMob()) {
  //   let onMouseOver = async (e) => { Tooltip.init('oriznl_yunikod'); document.removeEventListener('mouseover', onMouseOver); }
  //   document.addEventListener('mouseover', onMouseOver);
  // }
  transliterated_webpage = true;
}
