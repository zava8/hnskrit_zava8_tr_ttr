import React from "react";
import ReactDOM from "react-dom";
import browser from "webextension-polyfill";
import PopupPage from "./components/PopupPage";
import log from "loglevel";
const logDir = "popup";
function onLanguageDetected(lang) {
    console.log(`Language is: ${lang}`);
    switch(lang){
        case "hi" : case "mr": case "gu": case "pa": case "bh":
        case "bn" : case "or": case "as":
        case "ta" : case "ml" : case "kn" : case "te" :
            document.getElementById("unicode5_to_abc5").disabled = false;
            document.getElementById("abc5small_to_abc5").disabled = true;
            document.getElementById("abc8_to_abc5").disabled = true;

            document.getElementById("unicode5_to_abc5small").disabled = false;
            document.getElementById("abc5_to_abc5small").disabled = true;
            document.getElementById("abc8_to_abc5small").disabled = true;

            document.getElementById("unicode5_to_abc8").disabled = false;
            document.getElementById("abc5_to_abc8").disabled = true;
            document.getElementById("abc5small_to_abc8").disabled = true;
        break;
        case "en" : 
            // document.getElementById("unicode5_to_abc5").disabled = true;
            document.getElementById("abc5small_to_abc5").disabled = false;
            document.getElementById("abc8_to_abc5").disabled = false;

            // document.getElementById("unicode5_to_abc5small").disabled = true;
            document.getElementById("abc5_to_abc5small").disabled = false;
            document.getElementById("abc8_to_abc5small").disabled = false;

            // document.getElementById("unicode5_to_abc8").disabled = true;
            document.getElementById("abc5_to_abc8").disabled = false;
            document.getElementById("abc5small_to_abc8").disabled = false;
        break;
        default : 
            document.getElementById("unicode5_to_abc5").disabled = false;
            document.getElementById("abc5small_to_abc5").disabled = false;
            document.getElementById("abc8_to_abc5").disabled = false;

            document.getElementById("unicode5_to_abc5small").disabled = false;
            document.getElementById("abc5_to_abc5small").disabled = false;
            document.getElementById("abc8_to_abc5small").disabled = false;

            document.getElementById("unicode5_to_abc8").disabled = false;
            document.getElementById("abc5_to_abc8").disabled = false;
            document.getElementById("abc5small_to_abc8").disabled = false;
        break;

    }
}  
function onDetectError(error) {
    console.log(`Error: ${error}`);
}

ReactDOM.render(<PopupPage />, document.getElementById("root"));
document.addEventListener('DOMContentLoaded', () => {
    // const tab = (await browser.tabs.query({ currentWindow: true, active: true }))[0];
    var detecting = browser.tabs.detectLanguage();
    detecting.then(onLanguageDetected, onDetectError);
});
var ztrelem = document.getElementById("id_tr_select");
ztrelem.addEventListener('click', () => {

    var detecting = browser.tabs.detectLanguage();
    detecting.then(onLanguageDetected, onDetectError);
});
  
