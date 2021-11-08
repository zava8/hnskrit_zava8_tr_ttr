const u5_to_a5_dict = require('./u5_to_a5_dict.js');
const u5_to_a8_dict = require('./u5_to_a8_dict.js');

var u_to_a = function (input,isa8) {
  function is_in_it (list, val) {
    if (!Array.isArray(list)) { list = Object.keys(list); }
    return list.indexOf(val) !== -1;
  }
  const inputLength = input.length;
  let indeks = 0;
  let output = '';
  let curr_char = ''; let nekst_char = ''; // let prev_char = ''; 
  let curr_char_code = 0; let nekst_char_code = 0; // let prev_char_code = 0; 
  let prev_lang_code = 0; let curr_lang_code = 0; let nekst_lang_code = 0;
  let prev_char_modulo = 0; let curr_char_modulo = 0; let nekst_char_modulo = 0;
  let u_to_a_dict = null ;
  if(isa8) {u_to_a_dict = u5_to_a8_dict;} else {u_to_a_dict = u5_to_a5_dict;}
  while (indeks < inputLength) {
    if (0 === indeks) {
      prev_lang_code= curr_lang_code ; // prev_char = curr_char ; 
      prev_char_modulo = curr_char_modulo; // prev_char_code = curr_char_code ;
      curr_char = input[indeks];
      curr_char_code = curr_char.charCodeAt();
      curr_lang_code = (curr_char_code/0x80)>>0 ;
      curr_char_modulo = curr_char_code % 0x80 ;
    }
    else {
      prev_lang_code= curr_lang_code ; // prev_char = curr_char ;
      prev_char_modulo = curr_char_modulo; // prev_char_code = curr_char_code ;
      curr_char = nekst_char ;
      curr_char_code = curr_char.charCodeAt();
      curr_lang_code = (curr_char_code/0x80)>>0 ;
      curr_char_modulo = curr_char_code % 0x80 ;
    }
    nekst_char = input[indeks + 1];
    if(indeks+1 < inputLength) {
      nekst_char_code = nekst_char.charCodeAt();
      nekst_lang_code = (nekst_char_code/0x80)>>0 ;
      nekst_char_modulo = nekst_char_code % 0x80 ;
    }
    else {
      nekst_char_code = -1 ;
      nekst_lang_code = -1 ;
      nekst_char_modulo = -1 ;
    }
    if (curr_lang_code>0x11 && curr_lang_code<0x1B) {
      // 'H', // 	ह	939	2361
      if( 0x39 === curr_char_modulo ) {
        if(
          prev_lang_code>0x11 && prev_lang_code<0x1B &&
          is_in_it(u_to_a_dict.hard_consonants_modulo_list,prev_char_modulo)
        ) { output += 'H'; }
        else { output += 'H'; }
      }
      ///// 'N', // 	ं	902	2306	anuswara	anusvara bindu
      else if(2 == curr_char_modulo){ // 'मां: ऐस्पिरेंट्स में गुरी' : 'ma: espireNts mein guri', //  ं	902 anuswara	anusvara bindu
        if( nekst_lang_code>0x11 && nekst_lang_code<0x1B && 2 < nekst_char_modulo )
        {
          output += 'n';
        }
        // else
        // {
        //   output += 'Am';
        // }
      }
      else if (is_in_it([7,8,9,0xA,0xD,0xE,0xF,0x10,0x13,0x14],curr_char_modulo)) { //'kAi'
        if ( prev_lang_code>0 && prev_char_modulo > 0x14 && prev_char_modulo < 0x3A)
          {output += 'A';}
        output += u_to_a_dict.all_phoniks_list[curr_char_modulo];
      }
      else { output += u_to_a_dict.all_phoniks_list[curr_char_modulo]; }
      indeks++ ;
    } // end oph indik lang iph
    else {
      output += curr_char;
      indeks++ ;
    }
  }
  return output;
}
module.exports = u_to_a
