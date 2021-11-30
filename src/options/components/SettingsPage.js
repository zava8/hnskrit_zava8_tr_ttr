import React, { Component } from "react";
import browser from "webextension-polyfill";
import { updateLogLevel, overWriteLogLevel } from "src/common/log";
import { initSettings, resetAllSettings, exportSettings, importSettings } from "src/settings/settings";
import defaultSettings from "src/settings/defaultSettings";
import CategoryContainer from "./CategoryContainer";

export default class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isInit: false
    };
    this.init();
  }

  async init() {
    await initSettings();
    overWriteLogLevel();
    updateLogLevel();
    this.setState({ isInit: true });
  }

  render() {
    const settingsContent = (
      <ul>
        {defaultSettings.map((category, index) => (
          <CategoryContainer {...category} key={index} />
        ))}
        <CategoryContainer {...additionalCategory} />
      </ul>
    );

    return (
      <div>
        <p className="contentTitle">{browser.i18n.getMessage("settingslabel")}</p>
        <hr />
        {this.state.isInit ? settingsContent : ""}
      </div>
    );
  }
}

const additionalCategory = {
  category: "",
  elements: [
    {
      id: "importSettings",
      title: "importsettingslabel",
      captions: ["importsettingscaptionlabel"],
      type: "file",
      accept: ".json",
      value: "importbuttonlabel",
      onChange: importSettings
    },
    {
      id: "exportSettings",
      title: "eksportsettingslabel",
      captions: ["eksportsettingscaptionlabel"],
      type: "button",
      value: "eksportbuttonlabel",
      onClick: async () => {
        await exportSettings();
      }
    },
    {
      id: "resetSettings",
      title: "resetsettingslabel",
      captions: ["resetsettingscaptionlabel"],
      type: "button",
      value: "resetsettingsbuttonlabel",
      onClick: async () => {
        await resetAllSettings();
        location.reload(true);
      }
    }
  ]
};
