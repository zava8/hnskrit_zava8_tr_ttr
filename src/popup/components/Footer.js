import React, { Component } from "react";
import browser from "webextension-polyfill";
import generateLangOptions from "src/common/generateLangOptions";
import openUrl from "src/common/openUrl";
import "../styles/Footer.scss";
import transliterator from "src/common/transliterator"
import zabc_list_dict from "src/common/zabc"

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
    console.log("in footer.js:handleZtrButtonClick: targetZtr is : " + targetZtr);
    let tab = await browser.tabs.query({ active: true });
    tab = tab[0];
    console.log("in footer.js:handleZtrButtonClick: tab.id is : " + tab.id);
    console.log("sending message to tab.id(" + tab.id + ") { message: targetZtr } vhere targetZtr is : " + targetZtr);
    browser.tabs.sendMessage( tab.id, { message: targetZtr } ).catch(error => { console.log(error); });
    // var t = new transliterator();
    // t.transliterate_elem_content(document.body);
    // const tab = (await browser.tabs.query({ currentWindow: true, active: true }))[0];
    // browser.tabs.sendMessage( tab.id, { tr_selected_indeks: tr_selected_indeks } ).catch(error => { console.log(error); });

  };
  handleChange = e => { const lang = e.target.value; this.props.handleLangChange(lang); };
  handleChange2 = e => { const ztr = e.target.value; this.props.handleZtrChange(ztr); };

  render() {
    const { tabUrl, targetLang, targetZtr, langHistory } = this.props;

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
            <optgroup label="hski8"> <option value="abc8">abc8</option> <option value="abc8_u8z">abc8_u8z</option> </optgroup>
            <optgroup label="aski5"> <option value="abc5">abc5</option> <option value="abc5small">abc5</option></optgroup>
            <optgroup label="unikod5"> <option value="unikod5">unikod5</option> </optgroup>
          </select>
        </div>
        <div className="translateLink">
          {/* {tabUrl && <a onClick={this.handleZtrButtonClick}>{browser.i18n.getMessage("showLink")}</a>} */}
          <button type="button" id="transliterate" onClick={this.handleZtrButtonClick}>tr</button>
          <button type="button" id="untransliterate">utr</button>
        </div>             
      </div>
    );
  }
}
