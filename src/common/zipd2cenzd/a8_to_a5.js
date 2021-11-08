const a5_to_a8 = function (input) {
  const inputLength = input.length;
  let indeks = 0;
  let output1 = '';
  let output2 = '';
  let curr_char = ''; // let prev_char = ''; let prev2_char = '';
  while (indeks < inputLength) {
    curr_char = input[indeks];
    switch (curr_char) {
      case ':':  output1 += 'L'; break;   
      case ';':  output1 += 'J'; break;
      case '<':  output1 += 'Q'; break;
      case '=':  output1 += 'W'; break;
      case '>':  output1 += 'X'; break;

      case 'A':  output1 += ':'; break;   
      case 'B':  output1 += ';'; break;
      case 'C':  output1 += '<'; break;
      case 'D':  output1 += '='; break;
      case 'E':  output1 += '>'; break;

      case 'F':  output1 += 'gGgG'; break;

      case 'f':  output1 += 'N'; break;   
      case 'j':  output1 += 'H'; break;
      case 'q':  output1 += 'A'; break;
      case 'x':  output1 += 'T'; break;
      case 'w':  output1 += 'D'; break;      

      case '?':  output1 += 'F'; break;
   
      default: output1 += curr_char ;
    }
    indeks++ ;
  }
  output2 = output1.replace(/gGgG/g, "?");
  return output2;
}
module.exports = a5_to_a8
