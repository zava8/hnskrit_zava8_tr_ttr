import indik2abc from './indik2abc';
import u5c_to_zabc from './u5c_to_zabc';
class transliterator {
  transliterate_indik_abc (input,zabc_dikt) {
    return indik2abc(input,zabc_dikt);
  }
  transliterate_u5c_zabc (input) {
    return u5c_to_zabc(input);
  }
}
export default transliterator
