import React, { Component } from "react";
import browser from "webextension-polyfill";
import generateLangOptions from "src/common/generateLangOptions";
import openUrl from "src/common/openUrl";
import "../styles/Footer.scss";

export default class Footer extends Component {
  constructor(props) { super(props); this.langList = generateLangOptions(); }
  handleLinkClick = async () => {
    const { tabUrl, targetLang} = this.props;
    const encodedUrl = encodeURIComponent(tabUrl);
    const translateUrl = `https://translate.google.com/translate?hl=${targetLang}&tl=${targetLang}&sl=auto&u=${encodedUrl}`;
    openUrl(translateUrl);
  };

  handleChange = e => { const lang = e.target.value; this.props.handleLangChange(lang); };
  handleZtrChange = e => { const ztr = e.target.value; this.props.handleZtrChange(ztr); };

  render() {
    const { tabUrl, targetLang, langZtr, langHistory } = this.props;

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
        <div className="selectWrap">
          <select id="ztrList" onChange={this.handleZtrChange}>
            <optgroup label="hski8">
              <option value="abc8">abc8</option>
              <option value="abc8_u8z">abc8_u8z</option>
            </optgroup>
            <optgroup label="aski5">
              <option value="abc5">abc5</option>
            </optgroup>
            <optgroup label="unikod5">
              <option value="unikod5">unikod5</option>
            </optgroup>
          </select>
        </div>
        <div className="translateLink">
          {tabUrl && <a onClick={this.handleLinkClick}>{browser.i18n.getMessage("showLink")}</a>}
        </div>             
      </div>
    );
  }
}
