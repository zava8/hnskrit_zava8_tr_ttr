const u_to_a = require('./u_to_a.js');
const a5_to_a8 = require('./a5_to_a8.js');
const a8_to_a5 = require('./a8_to_a5.js');
// function detectMob() {
//   const toMatch = [ /Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i ];
//   return toMatch.some((toMatchItem) => { return navigator.userAgent.match(toMatchItem); });
// }
class transliterator {
  constructor(transliterated_webpage, observer) { this.transliterated_webpage = false; this.observer = null; }
  // transliterate_u_to_a (input_str,is_koding_a8) { return u_to_a(input_str,is_koding_a8); }
  // transliterate_a5_to_a8 (input_str) { return a5_to_a8(input_str); }
  // transliterate_a8_to_a5 (input_str) { return a8_to_a5(input_str); }
  transliterate_input(input_str,ztr_direction_const) {
    switch(ztr_direction_const) {
      case 0 : return u_to_a(input_str,false); //  console.log(" in index.js: transliterate_input case u5_to_a5: calling t.transliterate_u_to_a");
      case 1 : return u_to_a(input_str,true); // console.log(" in index.js: transliterate_input case u5_to_a8: calling t.transliterate_u_to_a");
      case 2 : return a5_to_a8(input_str); // console.log(" in index.js: transliterate_input case a5_to_a8: calling t.transliterate_a5_to_a8");
      case 3 : return a8_to_a5(input_str); // console.log(" in index.js: transliterate_input case a8_to_a5: calling t.transliterate_a8_to_a5");
    }
  }
  transliterate_elem_content(elem, ztr_direction_const) {
    let nods_dikt_list = [];
    let text = "";
    let nekst_node = null;
    let i = 0;
    let nodeIterator = elem.ownerDocument.createNodeIterator( elem, NodeFilter.SHOW_TEXT, {
          acceptNode: (node) => {
            if (node.parentNode && node.parentNode.nodeName !== 'SCRIPT') { return NodeFilter.FILTER_ACCEPT; }
          }
        },
        false
      );
    nekst_node = nodeIterator.nextNode() ;
    while (nekst_node) {
      nods_dikt_list.push({ tekstNode: nekst_node, start: text.length });
      text += nekst_node.nodeValue;
      nekst_node = nodeIterator.nextNode()
    }
    if (!nods_dikt_list.length) return;
    var nekst_nod_dikt;
    for (i = 0; i < nods_dikt_list.length; ++i) { nekst_nod_dikt = nods_dikt_list[i];
      var spanNode = document.createElement("span");
      spanNode.className = "ztred";
      spanNode.dataset.oldtekst = nekst_nod_dikt.tekstNode.textContent;
      nekst_nod_dikt.tekstNode.parentNode.replaceChild(spanNode, nekst_nod_dikt.tekstNode);
      spanNode.appendChild(nekst_nod_dikt.tekstNode);
    }
    var ztred_span_list = elem.getElementsByClassName('ztred');
    var nekst_ztred_span;
    for (i = 0; i < ztred_span_list.length; ++i)
    {
      nekst_ztred_span = ztred_span_list[i];
      nekst_ztred_span.textContent = this.transliterate_input(nekst_ztred_span.textContent,ztr_direction_const);
    }
  }
  untransliterate_webpage() {
    Tooltip.destroy()
    if (observer) observer.disconnect()
    var nodes = document.getElementsByClassName('ztred'), node;
    for (let i = 0;i < nodes.length;i++) {
      node = nodes[i];
      node.innerText = node.dataset.oriznl_yunikod;
    }
    transliterated_webpage = false
  }
}
module.exports = transliterator