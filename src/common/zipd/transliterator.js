import indik2abc from './indik2abc';
import u5c_to_zabc from './u5c_to_zabc';
class transliterator {
  transliterate_indik_abc (input,zabc_dikt) {
    // if (typeof input === 'string' || input instanceof String) {
    //   if(input !== "") { alert("transliterate_indik_abc: input is : " + input); }
    // }    
    return indik2abc(input,zabc_dikt);
  }
  transliterate_u5c_zabc (input) {
    return u5c_to_zabc(input);
  }
  
  transliterate(input) { 
    // if (typeof input === 'string' || input instanceof String) {
    //   if(input === "") { var a = 5;}
    //   else { alert("transliterate: input is : " + input); }
    // }    
    return transliterate_indik_abc(input, zabc_dikt);
  }
  transliterate_elem_content(elem) {
    var nodes = [], text = "", node,
      nodeIterator = elem.ownerDocument.createNodeIterator( elem, NodeFilter.SHOW_TEXT,
        {
          acceptNode: function(node) { if (node.parentNode && node.parentNode.nodeName !== 'SCRIPT') { return NodeFilter.FILTER_ACCEPT; } }
        },
        false
      );
    while (node = nodeIterator.nextNode()) { nodes.push({ textNode: node, start: text.length }); text += node.nodeValue }
    if (!nodes.length) return;
    // alert("transliterate_elem_content nodes.length is " + nodes.length);
    var flag = true ;
    for (var i = 0; i < nodes.length; ++i) {
      node = nodes[i];
      // if(i == 2) { alert("transliterate_elem_content " + node.textNode.textContent); }
      // if(flag && node.textNode.textContent.nodeValue !== "")
      //   { alert("transliterate_elem_content " + node.textNode.textContent.text); flag = false; }
      var spanNode = document.createElement("span");
      spanNode.className = "yunikes";
      spanNode.dataset.oriznl_yunikod = node.textNode.textContent;
      node.textNode.parentNode.replaceChild(spanNode, node.textNode);
      spanNode.appendChild(node.textNode);
    }
    nodes = elem.getElementsByClassName('yunikes');
    // alert("transliterate_elem_content" + nodes.length);
    flag = true ;
    for (var i = 0; i < nodes.length; ++i) { 
      node = nodes[i]; 
      // if(flag && node.textContent !== "") { alert("transliterate_elem_content 42 : " + node.textContent);  }
      node.textContent = this.transliterate(node.textContent);
      // if(flag && node.textContent !== "") { alert("transliterate_elem_content 44 : " + node.textContent); flag = false; }
    }
  }
}

export default transliterator
