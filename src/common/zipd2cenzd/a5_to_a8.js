var a5_to_a8 = function (input) {
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
      case ':':  output += 'A'; break;    // A means colon    
      case ';':  output += 'B'; break;    // B means colon    
      case '<':  output += 'C'; break;    // C means colon    
      case '=':  output += 'D'; break;    // D means colon    
      case '>':  output += 'E'; break;    // E means colon    
      case '?':  output += 'F'; break;    // F means colon    
      default: output += curr_char ;
    }
    indeks++ ;
  }
  return output;
}
module.exports = a5_to_a8
