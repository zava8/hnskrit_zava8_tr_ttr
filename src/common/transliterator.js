import unicodehindi_to_ascii from './unicodehindi_to_ascii.js';
import ascii_to_asciismall from './ascii_to_asciismall.js';
import unicodehindi_to_ascii_dict from './unicodehindi_to_ascii_dict.js';
function detectMob() {
  const toMatch = [ /Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i ];
  return toMatch.some((toMatchItem) => { return navigator.userAgent.match(toMatchItem); });
}
class transliterator {
  transliterate_unicodehindi_to_ascii (input,unicodehindi_to_ascii_dict) { return unicodehindi_to_ascii(input,unicodehindi_to_ascii_dict); }
  transliterate_ascii_to_asciismall (input) { return ascii_to_asciismall(input); }
  transliterate_input(input,ztr_dir_string) {
    switch(ztr_dir_string) {
      case "unicode5_to_abc5" : 
        console.log(" in index.js: transliterate_input case unicode5_to_abc5: calling t.transliterate_unicodehindi_to_ascii");
        return this.transliterate_unicodehindi_to_ascii(input, unicodehindi_to_ascii_dict);
    }
  }
  transliterate_elem_content(elem, ztr_dir_string) {
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
      nekst_ztred_span.textContent = this.transliterate_input(nekst_ztred_span.textContent,ztr_dir_string);
    }
  }
}
export default transliterator
