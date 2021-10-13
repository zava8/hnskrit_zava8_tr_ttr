import unicodehindi_to_ascii from './unicodehindi_to_ascii.js';
import ascii_to_asciismall from './ascii_to_asciismall.js';
class transliterator {
  transliterate_unicodehindi_to_ascii (input,unicodehindi_to_ascii_dict) { return unicodehindi_to_ascii(input,unicodehindi_to_ascii_dict); }
  transliterate_ascii_to_asciismall (input) { return ascii_to_asciismall(input); }
}
export default transliterator
