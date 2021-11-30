import React, { useState, useEffect } from "react";
import browser from "webextension-polyfill";
import browserInfo from "browser-info";
import queryString from "query-string";
import OptionsContainer from "./OptionContainer";
import {
  paypalLink,
  patreonLink,
  email,
  chromeExtensionUrl,
  firefoxAddonUrl
} from "src/common/personalUrls";
import manifest from "src/manifest-chrome.json";

export default props => {
  const query = queryString.parse(props.location.search);
  const extensionVersion = manifest.version;

  const [sponsorsHeihgt, setSponsorsHeight] = useState();

  useEffect(() => {
    const setHeight = e => {
      if (e.data[0] !== "setSponsorsHeight") return;
      setSponsorsHeight(e.data[1]);
    };
    window.addEventListener("message", setHeight);
    return () => window.removeEventListener("message", setHeight);
  });

  return (
    <div>
      <p className="contentTitle">{browser.i18n.getMessage("informationlabel")}</p>
      <hr />
      <OptionsContainer
        title={"extname"}
        captions={[]}
        type={"none"}
        updated={query.action === "updated"}
        extraCaption={
          <p className="caption">
            <a href="https://github.com/hscii/hnskrit/releases" target="_blank">
              Version {extensionVersion}
            </a>
            <span>　</span>
            <a
              href="https://github.com/hscii/hnskrit/blob/master/BACKERS.md"
              target="_blank"
            >
              {browser.i18n.getMessage("backerslabel")}
            </a>
          </p>
        }
      />

      <OptionsContainer
        title={"licenselabel"}
        captions={["Mozilla Public License, Version. 2.0"]}
        useRawCaptions={true}
        type={"none"}
      />
      <hr />
      <OptionsContainer title={"donationlabel"} captions={["donationcaptionlabel"]} type={"none"} />
      <OptionsContainer
        title={""}
        captions={[""]}
        type={"none"}
        extraCaption={
          <div>
            <a href={patreonLink} target="_blank">
              <img src="images/patreon.png" alt="Patreon"
                style={{ height: 44, marginRight: 20 }} />
            </a>
            <a href={paypalLink} target="_blank">
              <img src="images/paypal.png" alt="Paypal" />
            </a>
          </div>
        }
      />
      <OptionsContainer
        title={""}
        captions={[]}
        type={"none"}
        extraCaption={
          <div>
            <p className="caption">
              <a className="amazonurl" href={browser.i18n.getMessage("amazonurl")} target="_blank">
                {browser.i18n.getMessage("amazontitlelabel")}
              </a>
            </p>
            <p className="caption">email: {email}</p>
          </div>
        }
      />
      <hr />
      <OptionsContainer
        title={"sponsorslabel"}
        captions={[""]}
        type={"none"}
        extraCaption={
          <iframe src="https://zs810.tumblr.com"
            style={{ height: sponsorsHeihgt, marginTop: 10 }} />
        }
      />
      <hr />
      <OptionsContainer
        title={""}
        captions={[]}
        type={"none"}
        extraCaption={
          <div>
            <p>
              {browserInfo().name === "Chrome" ? (
                <a href={chromeExtensionUrl} target="_blank">
                  {browser.i18n.getMessage("ekstensionpagelabel")}
                </a>
              ) : (
                  <a href={firefoxAddonUrl} target="_blank">
                    {browser.i18n.getMessage("addonpagelabel")}
                  </a>
                )}
              <span>　</span>
              <a href="https://github.com/hscii/hnskrit" target="_blank">
                GitHub
              </a>
              <span>　</span>
            </p>
          </div>
        }
      />
    </div>
  );
};
