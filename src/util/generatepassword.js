import generator from 'generate-password';
const generatePassword=()=>{
    var password = generator.generate({
        length: 8,
        numbers: true
      });
      return password;
}
export {generatePassword};