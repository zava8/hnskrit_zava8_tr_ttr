/* * Thanks Subin Siby  https://subinsb.com/indicen
 * ztr : WebExtension to transliterate webpages
 * https://vk.com/zs810
 *
 * authors: 
 * subin <mail@subinsb.com> copyright 2020 Subin Siby <mail@subinsb.com>
 * viml kumar <zs810@vk.com> : modifications for multilingual birectional transliteration using modulo method
 * viml kumar <zs810@vk.com> : copyright 2021 viml kumar <zs810@vk.com>
*/
import browser from 'webextension-polyfill';
import transliterator from './transliterator.js'
import Tooltip from './tooltip.js';
import unicodehindi_to_ascii_dict from './unicodehindi_to_ascii_dict.js';
import '../styles/contentStyle.scss';
var t, transliterated_webpage = false, observer = null, overlay = false;
function transliterate(input,tr_selected_indeks) {
  if (0 < tr_selected_indeks && 0xC > tr_selected_indeks)
    { return t.transliterate_unicodehindi_to_ascii(input, unicodehindi_to_ascii_dict); }
  if (0 === tr_selected_indeks) { return t.transliterate_ascii_to_asciismall(input); }
}
function transliterate_elem_content(elem, tr_selected_indeks) {
  var nods_dikt_list = [], text = "", nekst_node,
    nodeIterator = elem.ownerDocument.createNodeIterator( elem, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
          if (node.parentNode && node.parentNode.nodeName !== 'SCRIPT') { return NodeFilter.FILTER_ACCEPT; }
        }
      },
      false
    );
  while (nekst_node = nodeIterator.nextNode()) {
    nods_dikt_list.push({ tekstNode: nekst_node, start: text.length });
    text += nekst_node.nodeValue;
  }
  if (!nods_dikt_list.length) return;
  var nekst_nod_dikt;
  for (var i = 0; i < nods_dikt_list.length; ++i) { nekst_nod_dikt = nods_dikt_list[i];
    var spanNode = document.createElement("span");
    spanNode.className = "ztred";
    spanNode.dataset.oldtekst = nekst_nod_dikt.tekstNode.textContent;
    nekst_nod_dikt.tekstNode.parentNode.replaceChild(spanNode, nekst_nod_dikt.tekstNode);
    spanNode.appendChild(nekst_nod_dikt.tekstNode);
  }
  var ztred_span_list = elem.getElementsByClassName('ztred');
  var nekst_ztred_span;
  for (var i = 0; i < ztred_span_list.length; ++i)
  {
    nekst_ztred_span = ztred_span_list[i];
    nekst_ztred_span.textContent = transliterate(nekst_ztred_span.textContent,tr_selected_indeks);
  }
}
function untransliterate_webpage() {
  Tooltip.destroy();
  if (observer) observer.disconnect();
  var ztred_span_list = document.getElementsByClassName('ztred');
  var nekst_ztred_span;
  for (let i = 0;i < ztred_span_list.length;i++) {
    nekst_ztred_span = ztred_span_list[i];
    var span_oldtekst = nekst_ztred_span.dataset.oldtekst ;
    if (!span_oldtekst.startsWith("\n")) { nekst_ztred_span.innerText = span_oldtekst; }   
  }
  transliterated_webpage = false;
}
/** * Thanks Michael Zaporozhets * https://stackoverflow.com/a/11381730 */
function detectMob() {
  const toMatch = [ /Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i ];
  return toMatch.some((toMatchItem) => { return navigator.userAgent.match(toMatchItem); });
}
function transliterate_webpage(tr_selected_indeks) {
  t = new transliterator();
  transliterate_elem_content(document.body, tr_selected_indeks);
  if (overlay && !detectMob()) {
    let onMouseOver = async (e) => { Tooltip.init('oriznl_yunikod'); document.removeEventListener('mouseover', onMouseOver); }
    document.addEventListener('mouseover', onMouseOver);
  }
  transliterated_webpage = true;
}
// browser.runtime.onMessage.addListener(request => {
//   if (request.targetZtr) { transliterate_webpage(request.targetZtr); }
//   // else if (request.untransliterate) { untransliterate_webpage(); }
//   else { return Promise.resolve(transliterated_webpage); }
// }); // On popup button click

