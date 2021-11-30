import React, { Component } from "react";
import browser from "webextension-polyfill";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CopyIcon from "../icons/copy.svg";
import "../styles/CopyButton.scss";

export default class CopyButton extends Component {
  constructor(props) {
    super(props);
    this.state = { isCopied: false };
  }

  handleCopy = () => {
    this.setState({ isCopied: true });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.text !== nextProps.text) this.setState({ isCopied: false });
  }

  render() {
    const { text } = this.props;
    if (!text) return null;

    return (
      <div className="copy">
        {this.state.isCopied && (
          <span className="copiedText">{browser.i18n.getMessage("copiedlabel")}</span>
        )}
        <CopyToClipboard text={text} onCopy={this.handleCopy}>
          <button className="copyButton" title={browser.i18n.getMessage("copylabel")}>
            <CopyIcon />
          </button>
        </CopyToClipboard>
      </div>
    );
  }
}
