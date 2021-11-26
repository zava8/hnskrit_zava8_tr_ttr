import React, { Component } from "react";
import browser from "webextension-polyfill";
import log from "loglevel";
import { initSettings, getSettings, setSettings } from "src/settings/settings";
import { updateLogLevel, overWriteLogLevel } from "src/common/log";
import translate from "src/common/translate";
import Header from "./Header";
import InputArea from "./InputArea";
import ResultArea from "./ResultArea";
import Footer from "./Footer";
import "../styles/PopupPage.scss";
import transliterator from 'kvz-transliteration';
// import transliterator from 'src/common/transliterator.js'
// import unicodehindi_to_ascii_dict from 'src/common/unicodehindi_to_ascii_dict.js';
const logDir = "popup/PopupPage";
const getTabInfo = async () => {
  try {
    const tab = (await browser.tabs.query({ currentWindow: true, active: true }))[0];
    const tabUrl = browser.tabs.sendMessage(tab.id, { message: "getTabUrl" });
    const selectedText = browser.tabs.sendMessage(tab.id, { message: "getSelectedText" });
    const isEnabledOnPage = browser.tabs.sendMessage(tab.id, { message: "getEnabled" });
    const tabInfo = await Promise.all([tabUrl, selectedText, isEnabledOnPage]);
    return {
      tab_id:tab.id, isConnected: true, url: tabInfo[0], selectedText: tabInfo[1], isEnabledOnPage: tabInfo[2]
    };
  } catch (e) { return { isConnected: false, url: "", selectedText: "", isEnabledOnPage: false }; }
};
function onLanguageDetected(lang) { console.log(`Language is: ${lang}`); }
function onDetectError(error) { console.log(`Error: ${error}`); }
export default class PopupPage extends Component {
  constructor(props) { super(props);
    this.state = { targetLang: "", targetZtr: "", targetPhont: "", inputText: "", resultText: "", ztrText: "",  candidateText: "",
      sourceLang: "", statusText: "OK", tabUrl: "", tab_id: "", tab_lang: "", isConnected: true,
      isEnabledOnPage: true,
      langHistory: []
    };
    this.isSwitchedSecondLang = false;
    this.init();
  }
  init = async () => {
    await initSettings(); overWriteLogLevel(); updateLogLevel();
    document.body.dataset.theme = getSettings("theme");
    const targetLang = getSettings("targetLang");
    let langHistory = getSettings("langHistory");
    if (!langHistory) {
      const secondLang = getSettings("secondTargetLang");
      langHistory = [targetLang, secondLang];
      setSettings("langHistory", langHistory);
    }
    this.setState({ targetLang: targetLang, targetZtr: "", targetPhont: "", langHistory: langHistory });
    const tabInfo = await getTabInfo();
    this.setState({ isConnected: tabInfo.isConnected, inputText: tabInfo.selectedText,
      tabUrl: tabInfo.url, tab_id: tabInfo.tab_id,
      isEnabledOnPage: tabInfo.isEnabledOnPage
    });
    browser.browserAction.onClicked.addListener(function() {
      var detecting = browser.tabs.detectLanguage();
      detecting.then(onLanguageDetected, onDetectError);
    });
    if (tabInfo.selectedText !== "") this.handleInputText(tabInfo.selectedText);
    // var fullURL = browser.runtime.getURL("beasts/frog.html");
    // console.log(fullURL);
  };
  handleInputText = inputText => { log.log(logDir, "handleInputText()", inputText);
    this.setState({ inputText: inputText });
    const waitTime = getSettings("waitTime");
    clearTimeout(this.inputTimer);
    this.inputTimer = setTimeout(async () => {
      const result = await this.translateText(inputText, this.state.targetLang);
      this.switchSecondLang(result);
    }, waitTime);
  };
  setLangHistory = lang => {
    let langHistory = getSettings("langHistory") || [];
    langHistory.push(lang);
    if (langHistory.length > 30) langHistory = langHistory.slice(-30);
    setSettings("langHistory", langHistory);
    this.setState({ langHistory: langHistory });
  };
  handleLangChange = lang => { log.info(logDir, "handleLangChange()", lang);
    this.setState({ targetLang: lang });
    const inputText = this.state.inputText;
    if (inputText !== "") this.translateText(inputText, lang, targetZtr);
    this.setLangHistory(lang);
  };
  translateText = async (text, targetLang, targetZtr) => { log.info(logDir, "translateText()", text, targetLang, targetZtr);
    const result = await translate(text, "auto", targetLang);
    var ztrText = "";
    if (result.resultText !== "") {
      var t = new transliterator();
      ztrText = t.transliterate_unicodehindi_to_ascii(result.resultText, unicodehindi_to_ascii_dict); 
    }
    this.setState({
      resultText: result.resultText, ztrText: ztrText, candidateText: result.candidateText, statusText: result.statusText,
      sourceLang: result.sourceLanguage, 
    });
    return result;
  };  
  handleZtrChange = ztr => { 
    this.setState({ targetZtr: ztr });
    var detecting = browser.tabs.detectLanguage();
    detecting.then(onLanguageDetected, onDetectError);
  };
  handlePhontChange = phont => { 
    this.setState({ targetPhont: phont });
  };
  switchSecondLang = result => {
    if (!getSettings("ifChangeSecondLang")) return;
    const defaultTargetLang = getSettings("targetLang"); const secondLang = getSettings("secondTargetLang");
    if (defaultTargetLang === secondLang) return;
    const equalsSourceAndTarget = result.sourceLanguage === this.state.targetLang && result.percentage > 0;
    const equalsSourceAndDefault = result.sourceLanguage === defaultTargetLang && result.percentage > 0;
    if (!this.isSwitchedSecondLang) {
      if (equalsSourceAndTarget && equalsSourceAndDefault) { log.info(logDir, "=>switchSecondLang()", result, secondLang);
        this.handleLangChange(secondLang); this.isSwitchedSecondLang = true;
      }
    } else {
      if (!equalsSourceAndDefault) { log.info(logDir, "=>switchSecondLang()", result, defaultTargetLang);
        this.handleLangChange(defaultTargetLang); this.isSwitchedSecondLang = false;
      }
    }
  };
  toggleEnabledOnPage = async e => { const isEnabled = e.target.checked; 
    this.setState({ isEnabledOnPage: isEnabled });
    try {
      const tab = (await browser.tabs.query({ currentWindow: true, active: true }))[0];
      if (isEnabled) await browser.tabs.sendMessage(tab.id, { message: "enableExtension" });
      else await browser.tabs.sendMessage(tab.id, { message: "disableExtension" });
    } catch (e) {}
  };
  render() {
    return (
      <div>
        <Header toggleEnabledOnPage={this.toggleEnabledOnPage} isEnabledOnPage={this.state.isEnabledOnPage}
          isConnected={this.state.isConnected}
        />
        <InputArea inputText={this.state.inputText} handleInputText={this.handleInputText} sourceLang={this.state.sourceLang} />
        <hr/>
        <ResultArea inputText={this.state.inputText} targetLang={this.state.targetLang} targetZtr={this.state.targetZtr}
          ztrText={this.state.ztrText} candidateText={this.state.candidateText}
          statusText={this.state.statusText}
        />
        <Footer tabUrl={this.state.tabUrl} targetLang={this.state.targetLang} targetZtr={this.state.targetZtr}
          langHistory={this.state.langHistory} handleLangChange={this.handleLangChange}
          handleZtrChange={this.handleZtrChange}/>
          <br/>
          <img src={browser.runtime.getURL("images/phoniks_smal_larz.jpg")}></img>
      </div>
    );
  }
}
