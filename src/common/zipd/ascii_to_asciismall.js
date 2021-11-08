var ascii_to_asciismall = function (input) {
  const inputLength = input.length;
  let indeks = 0;
  let output = '';
  let curr_char = ''; let prev_char = '';
  while (indeks < inputLength) {
    prev_char = curr_char;
    curr_char = input[indeks].toLowerCase();
    switch (curr_char) {
      case 'f':  output += 'ph'; break;
      case 'j':  output += 'z'; break;
      case 'q':  output += 'k'; break;
      case 'x':  output += 'X'; break;        
      case 'w': if('o' == prev_char) { output += 'u'; } else { output += 'v'; } break;
      default: output += curr_char ;
    }
    indeks++ ;
  }
  return output;
}
export default ascii_to_asciismall
