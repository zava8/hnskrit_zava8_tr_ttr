import browser from "webextension-polyfill";
import generateLangOptions from "src/common/generateLangOptions";

const getDefaultLangs = () => {
  const uiLang = browser.i18n.getUILanguage();
  const langOptions = generateLangOptions();

  const shouldUseUiLang = langOptions.some(lang => lang.value == uiLang);
  const targetLang = shouldUseUiLang ? uiLang : "en";
  const secondTargetLang = targetLang === "en" ? "ja" : "en";

  return { targetLang, secondTargetLang };
};

const langlistOptions = generateLangOptions();
const defaultLangs = getDefaultLangs();
const getTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";

export default [
  {
    category: "generallabel",
    elements: [
      {
        id: "targetLang",
        title: "targetlanglabel",
        captions: ["targetlangcaptionlabel"],
        type: "select",
        default: defaultLangs.targetLang,
        options: langlistOptions,
        useRawOptionName: true
      },
      {
        id: "secondTargetLang",
        title: "secondtargetlanglabel",
        captions: ["secondtargetlangcaptionlabel"],
        type: "select",
        default: defaultLangs.secondTargetLang,
        options: langlistOptions,
        useRawOptionName: true
      },
      {
        id: "ifsho_Candidate",
        title: "ifsho_candidatelabel",
        captions: ["ifsho_candidatecaptionlabel"],
        type: "checkbox",
        default: true
      }
    ]
  },
  {
    category: "vebpagelabel",
    elements: [
      {
        id: "vhenSelectText",
        title: "vhenselecttekstlabel",
        captions: [],
        type: "none",
        default: "sho_Button",
        childElements: [
          {
            id: "vhenSelectText",
            title: "ifsho_buttonlabel",
            captions: ["ifsho_buttoncaptionlabel"],
            type: "radio",
            value: "sho_Button"
          },
          {
            id: "vhenSelectText",
            title: "ifautotranslatelabel",
            captions: ["ifautotranslatecaptionlabel"],
            type: "radio",
            value: "sho_Panel"
          },
          {
            id: "vhenSelectText",
            title: "dontsho_buttonlabel",
            captions: ["dontsho_buttoncaptionlabel"],
            type: "radio",
            value: "dontsho_Button"
          },
          {
            id: "ifCheckLang",
            title: "ifchecklanglabel",
            captions: ["ifchecklangcaptionlabel"],
            type: "checkbox",
            default: true,
            hr: true
          }
        ]
      },
      {
        id: "ifOnlyTranslatevhenModifierKeyPressed",
        title: "ifonlytranslatevhenmodifierkeypressedlabel",
        captions: ["ifonlytranslatevhenmodifierkeypressedcaptionlabel"],
        type: "checkbox",
        default: false,
        childElements: [
          {
            id: "modifierKey",
            title: "modifierkeylabel",
            captions: [],
            type: "select",
            default: "shift",
            options: [
              {
                name: "shiftlabel",
                value: "shift"
              },
              {
                name: "ctrllabel",
                value: "ctrl"
              },
              {
                name: "altlabel",
                value: "alt"
              },
              {
                name: "cmdlabel",
                value: "cmd"
              }]
          }
        ]
      },
      {
        id: "ifChangeSecondLangOnPage",
        title: "ifchangesecondlanglabel",
        captions: ["ifchangesecondlangonpagecaptionlabel"],
        type: "checkbox",
        default: false
      },
      {
        title: "disabletranslationlabel",
        captions: [],
        type: "none",
        childElements: [
          {
            id: "isDisabledInTextFields",
            title: "isdisabledintekstfieldslabel",
            captions: ["isdisabledintextfieldscaptionlabel"],
            type: "checkbox",
            default: false
          },
          {
            id: "isDisabledInCodeElement",
            title: "isdisabledincodeelementlabel",
            captions: ["isdisabledincodeelementcaptionlabel"],
            type: "checkbox",
            default: false
          },
          {
            id: "ignoredDocumentLang",
            title: "ignoreddocumentlanglabel",
            captions: ["ignoreddocumentlangcaptionlabel"],
            type: "text",
            default: "",
            placeholder: "en, ru, zh"
          },
          {
            id: "disableUrlList",
            title: "disableurllistlabel",
            captions: ["disableurllistcaptionlabel"],
            type: "textarea",
            default: "",
            placeholder: "https://example.com/*\nhttps://example.net/*"
          }
        ]
      }
    ]
  },
  {
    category: "toolbarlabel",
    elements: [
      {
        id: "vaitTime",
        title: "vaittimelabel",
        captions: ["vaittimecaptionlabel", "vaittime2captionlabel"],
        type: "number",
        min: 0,
        placeholder: 500,
        default: 500
      },
      {
        id: "ifChangeSecondLang",
        title: "ifchangesecondlanglabel",
        captions: ["ifchangesecondlangcaptionlabel"],
        type: "checkbox",
        default: true
      }
    ]
  },
  {
    category: "menulabel",
    elements: [
      {
        id: "ifsho_Menu",
        title: "ifsho_menulabel",
        captions: ["ifsho_menucaptionlabel"],
        type: "checkbox",
        default: true
      }
    ]
  },
  {
    category: "stylelabel",
    elements: [
      {
        id: "theme",
        title: "themelabel",
        captions: ["themecaptionlabel"],
        type: "select",
        default: getTheme(),
        options: [
          {
            name: "lightlabel",
            value: "light"
          },
          {
            name: "darklabel",
            value: "dark"
          }
        ]
      },
      {
        title: "buttonstylelabel",
        captions: ["buttonstylecaptionlabel"],
        type: "none",
        childElements: [
          {
            id: "buttonSize",
            title: "buttonsizelabel",
            captions: [],
            type: "number",
            min: 1,
            placeholder: 22,
            default: 22
          },
          {
            id: "buttonDirection",
            title: "displaydirectionlabel",
            captions: [],
            type: "select",
            default: "bottomRight",
            options: [
              {
                name: "toplabel",
                value: "top"
              },
              {
                name: "bottomlabel",
                value: "bottom"
              },
              {
                name: "rightlabel",
                value: "right"
              },
              {
                name: "leftlabel",
                value: "left"
              },
              {
                name: "toprightlabel",
                value: "topRight"
              },
              {
                name: "topleftlabel",
                value: "topLeft"
              },
              {
                name: "bottomrightlabel",
                value: "bottomRight"
              },
              {
                name: "bottomleftlabel",
                value: "bottomLeft"
              }
            ]
          },
          {
            id: "buttonOffset",
            title: "positionoffsetlabel",
            captions: [],
            type: "number",
            default: 10,
            placeholder: 10
          }
        ]
      },
      {
        title: "panelstylelabel",
        captions: ["panelstylecaptionlabel"],
        type: "none",
        childElements: [
          {
            id: "width",
            title: "vidthlabel",
            captions: [],
            type: "number",
            min: 1,
            placeholder: 300,
            default: 300
          },
          {
            id: "height",
            title: "heightlabel",
            captions: [],
            type: "number",
            min: 1,
            placeholder: 200,
            default: 200
          },
          {
            id: "fontSize",
            title: "fontsizelabel",
            captions: [],
            type: "number",
            min: 1,
            placeholder: 13,
            default: 13
          },
          {
            id: "panelReferencePoint",
            title: "referencepointlabel",
            captions: [],
            type: "select",
            default: "bottomSelectedText",
            options: [
              {
                name: "topselectedtekstlabel",
                value: "topSelectedText"
              },
              {
                name: "bottomselectedtekstlabel",
                value: "bottomSelectedText"
              },
              {
                name: "clickedpointlabel",
                value: "clickedPoint"
              }
            ]
          },
          {
            id: "panelDirection",
            title: "displaydirectionlabel",
            captions: [],
            type: "select",
            default: "bottom",
            options: [
              {
                name: "toplabel",
                value: "top"
              },
              {
                name: "bottomlabel",
                value: "bottom"
              },
              {
                name: "rightlabel",
                value: "right"
              },
              {
                name: "leftlabel",
                value: "left"
              },
              {
                name: "toprightlabel",
                value: "topRight"
              },
              {
                name: "topleftlabel",
                value: "topLeft"
              },
              {
                name: "bottomrightlabel",
                value: "bottomRight"
              },
              {
                name: "bottomleftlabel",
                value: "bottomLeft"
              }
            ]
          },
          {
            id: "panelOffset",
            title: "positionoffsetlabel",
            captions: [],
            type: "number",
            default: 10,
            placeholder: 10
          },
          {
            id: "resultFontColor",
            title: "resultfontcolorlabel",
            captions: [],
            type: "color",
            default: getTheme() === "light" ? "#000000" : "#e6e6e6"
          },
          {
            id: "candidateFontColor",
            title: "candidatefontcolorlabel",
            captions: [],
            type: "color",
            default: getTheme() === "light" ? "#737373" : "#aaaaaa"
          },
          {
            id: "bgColor",
            title: "bgcolorlabel",
            captions: [],
            type: "color",
            default: getTheme() === "light" ? "#ffffff" : "#181818"
          }
        ]
      }
    ]
  },
  {
    category: "otherlabel",
    elements: [
      {
        id: "issho_OptionsPagevhenUpdated",
        title: "is_sho_options_page_vhen_updatedlabel",
        captions: ["is_sho_options_page_vhen_updated_caption_label"],
        type: "checkbox",
        default: true
      },
      {
        id: "isDebugMode",
        title: "isdebugmodelabel",
        captions: ["isdebugmodecaptionlabel"],
        type: "checkbox",
        default: false
      }
    ]
  }
];
