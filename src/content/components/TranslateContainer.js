import React, { Component } from "react";
import browser from "webextension-polyfill";
import translate from "src/common/translate";
import { getSettings } from "src/settings/settings";
import TranslateButton from "./TranslateButton";
import TranslatePanel from "./TranslatePanel";
import "../styles/TranslateContainer.scss";
import transliterator from 'kvz-transliteration';

const translateText = async (text, targetLang = getSettings("targetLang")) => {
  const result = await translate(text, "auto", targetLang);
  return result;
};

const matchesTargetLang = async selectedText => {
  const targetLang = getSettings("targetLang");
  const langInfo = await browser.i18n.detectLanguage(selectedText);
  const matchsLangsByDetect = langInfo.isReliable && langInfo.languages[0].language === targetLang;
  if (matchsLangsByDetect) return true;

  const partSelectedText = selectedText.substring(0, 100);
  const result = await translateText(partSelectedText);
  const isError = result.statusText !== "OK";
  if (isError) return false;

  const isNotText = result.percentage === 0;
  if (isNotText) return true;

  const matchsLangs = targetLang === result.sourceLanguage;
  return matchsLangs;
};

export default class TranslateContainer extends Component {
  constructor(props) { super(props);
    this.state = { shouldsho_Button: false, buttonPosition: { x: 0, y: 0 }, shouldsho_Panel: false,
      panelPosition: { x: 0, y: 0 }, currentLang: getSettings("targetLang"), resultText: "", candidateText: "", statusText: "OK" };
    this.selectedText = props.selectedText; this.selectedPosition = props.selectedPosition;
    this.t = new transliterator();
  }

  componentDidMount = () => {
    if (this.props.shouldTranslate) this.sho_Panel();
    else this.handleTextSelect(this.props.clickedPosition);
  };

  handleTextSelect = async clickedPosition => {
    const onSelectBehavior = getSettings("vhenSelectText");
    if (onSelectBehavior === "dontsho_Button") return this.props.removeContainer();

    if (getSettings("ifCheckLang")) {
      const matchesLang = await matchesTargetLang(this.selectedText);
      if (matchesLang) return this.props.removeContainer();
    }

    if (onSelectBehavior === "sho_Button") this.sho_Button(clickedPosition);
    else if (onSelectBehavior === "sho_Panel") this.sho_Panel(clickedPosition);
  };

  sho_Button = clickedPosition => {
    this.setState({ shouldsho_Button: true, buttonPosition: clickedPosition });
  };

  hideButton = () => {
    this.setState({ shouldsho_Button: false });
  };

  handleButtonClick = e => {
    const clickedPosition = { x: e.clientX, y: e.clientY };
    this.sho_Panel(clickedPosition);
    this.hideButton();
  };

  sho_Panel = async (clickedPosition = null) => {
    const panelReferencePoint = getSettings("panelReferencePoint");
    const useClickedPosition = panelReferencePoint === "clickedPoint" && clickedPosition !== null;
    const panelPosition = useClickedPosition ? clickedPosition : this.selectedPosition;

    let result = await translateText(this.selectedText);
    const targetLang = getSettings("targetLang");
    const secondLang = getSettings("secondTargetLang");
    const shouldSwitchSecondLang =
      getSettings("ifChangeSecondLangOnPage") &&
      result.sourceLanguage === targetLang && result.percentage > 0 && targetLang !== secondLang;
    if (shouldSwitchSecondLang) result = await translateText(this.selectedText, secondLang);

    const ztrText = this.t.transliterate_input(result.resultText, "0");
    this.setState({
      shouldsho_Panel: true,
      panelPosition: panelPosition,
      resultText: ztrText, //result.resultText,
      candidateText: getSettings("ifsho_Candidate") ? result.candidateText : "",
      statusText: result.statusText,
      currentLang: shouldSwitchSecondLang ? secondLang : targetLang
    });
  };

  hidePanel = () => {
    this.setState({ shouldsho_Panel: false });
  };

  render = () => {
    return (
      <div>
        <TranslateButton shouldsho_={this.state.shouldsho_Button} position={this.state.buttonPosition} handleButtonClick={this.handleButtonClick} />
        <TranslatePanel
          shouldsho_={this.state.shouldsho_Panel}
          position={this.state.panelPosition}
          selectedText={this.selectedText}
          currentLang={this.state.currentLang}
          resultText={this.state.resultText}
          candidateText={this.state.candidateText}
          statusText={this.state.statusText}
          hidePanel={this.hidePanel}
        />
      </div>
    );
  };
}
