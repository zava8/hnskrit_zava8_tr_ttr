import browserInfo from "browser-info";

const browserName = browserInfo().name;
const suffix = browserName === "Chrome" ? "fc" : "";
export const email = `zs810@vk.com`;
export const paypalLink = `https://paypal.com/cgi-bin/webscr?cmd=_xclick&no_shipping=1&business=hscii.firefox@gmail.com&item_name=hnskrit for ${browserName} - Donation`;
export const patreonLink = "https://patreon.com/hscii";
export const chromeExtensionUrl = `https://chrome.google.com/webstore/detail/ibplnjkanclpjokhdolnendpplpjiace`;
export const firefoxAddonUrl = `https://addons.mozilla.org/firefox/addon/hnskrit/`;
