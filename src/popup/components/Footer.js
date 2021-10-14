import React, { Component } from "react";
import browser from "webextension-polyfill";
import generateLangOptions from "src/common/generateLangOptions";
import openUrl from "src/common/openUrl";
import "../styles/Footer.scss";
// import transliterator from "src/common/transliterator"
// import zabc_list_dict from "src/common/zabc"

export default class Footer extends Component {
  constructor(props) { super(props); this.langList = generateLangOptions(); }
  handleLinkClick = async () => {
    const { tabUrl, targetLang} = this.props;
    const encodedUrl = encodeURIComponent(tabUrl);
    const translateUrl = `https://translate.google.com/translate?hl=${targetLang}&tl=${targetLang}&sl=auto&u=${encodedUrl}`;
    openUrl(translateUrl);
  };
  handleZtrButtonClick = async () => {
    const { tabUrl, targetZtr} = this.props;
    let tab = await browser.tabs.query({ active: true });
    tab = tab[0];
    console.log("in footer.js:handleZtrButtonClick: tab.id is : " + tab.id);
    console.log("sending message to tab.id(" + tab.id + ") { message: targetZtr } vhere targetZtr is : " + targetZtr);
    browser.tabs.sendMessage( tab.id, { message: targetZtr } ).catch(error => { console.log(error); });
  };
  handleChange = e => { const lang = e.target.value; this.props.handleLangChange(lang); };
  handleChange2 = e => { const ztr = e.target.value; this.props.handleZtrChange(ztr); };
  handleChange3 = e => { const phont = e.target.value; this.props.handlePhontChange(phont); };

  render() {
    const { tabUrl, targetLang, targetZtr, targetPhont, langHistory } = this.props;
    return (
      <div id="footer">
        <div className="selectWrap">
          <select id="langList" value={targetLang} onChange={this.handleChange} title={browser.i18n.getMessage("targetLangLabel")} >
            <optgroup label={browser.i18n.getMessage("recentLangLabel")}>
              {this.langList.filter(option => langHistory.includes(option.value))
                .map(option => ( <option value={option.value} key={option.value}> {option.name} </option> ))}
            </optgroup>
            <optgroup label={browser.i18n.getMessage("allLangLabel")}>
              {this.langList.map(option => ( <option value={option.value} key={option.value}> {option.name} </option> ))}
            </optgroup>
          </select>
        </div>
        <div className="translateLink">
          {tabUrl && <a onClick={this.handleLinkClick}>{browser.i18n.getMessage("showLink")}</a>}
        </div>
        <div className="selectWrap">
          <select id="id_tr_select" value={targetZtr} onChange={this.handleChange2} title={browser.i18n.getMessage("targetZtrLabel")} >
            <option value="sel">select ztr</option>
            <optgroup label="ascii5">
              <option id="unicode5_to_abc5" value="unicode5_to_abc5">unicode5_to_abc5</option>
              <option id="abc5small_to_abc5" value="abc5small_to_abc5">abc5small_to_abc5</option>
              <option id="abc8_to_abc5" value="abc8_to_abc5">abc8_to_abc5</option>
            </optgroup>
            <optgroup label="ascii5small">
              <option id="unicode5_to_abc5small" value="unicode5_to_abc5small">unicode5_to_abc5small</option>
              <option id="abc5_to_abc5small" value="abc5_to_abc5small">abc5_to_abc5small</option>
              <option id="abc8_to_abc5small" value="abc8_to_abc5small">abc8_to_abc5small</option>
            </optgroup>
            <optgroup label="hskii8">
              <option id="unicode5_to_abc8" value="unicode5_to_abc8">unicode5_to_abc8</option>
              <option id="abc5_to_abc8" value="abc5_to_abc8">abc5_to_abc8</option>
              <option id="abc5small_to_abc8" value="abc5small_to_abc8">abc5small_to_abc8</option>
            </optgroup>            
          </select>
        </div>
        <div className="translateLink">
          {/* {tabUrl && <a onClick={this.handleZtrButtonClick}>{browser.i18n.getMessage("showLink")}</a>} */}
          <button type="button" id="transliterate" onClick={this.handleZtrButtonClick}>tr</button>
          <button type="button" id="untransliterate">utr</button>
        </div>
        <div className="selectWrap">
          <select id="id_phont_select" value={targetPhont} onChange={this.handleChange3} title="select phont cenz">
            <option value="sel">select phont cenz</option>
            <option value="sel">no phont cenz</option>
            <optgroup label="ascii 5 phonts">
              <option id="phont_unicode5_to_abc5" value="phont_unicode5_to_abc5">unicode5_to_abc5</option>
              <option id="phont_abc5small_to_abc5" value="phont_abc5small_to_abc5">abc5small_to_abc5</option>
              <option id="phont_abc8_to_abc5" value="phont_abc8_to_abc5">abc8_to_abc5</option>
            </optgroup>
            <optgroup label="ascii5small phonts">
              <option id="phont_unicode5_to_abc5small" value="phont_unicode5_to_abc5small">unicode5_to_abc5small</option>
              <option id="phont_abc5_to_abc5small" value="phont_abc5_to_abc5small">abc5_to_abc5small</option>
              <option id="phont_abc8_to_abc5small" value="phont_abc8_to_abc5small">abc8_to_abc5small</option>
            </optgroup>
            <optgroup label="hskii8 phonts">
              <option id="phont_unicode5_to_abc8" value="phont_unicode5_to_abc8">unicode5_to_abc8</option>
              <option id="phont_abc5_to_abc8" value="phont_abc5_to_abc8">abc5_to_abc8</option>
              <option id="phont_abc5small_to_abc8" value="phont_abc5small_to_abc8">abc5small_to_abc8</option>
            </optgroup>            
          </select>
        </div>                    
      </div>
    );
  }
}
