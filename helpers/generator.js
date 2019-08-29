const axios = require('axios')

module.exports = {
  genQR: async function (message){
    if (message.length > 900) {
      return ctx.reply('Your text is too long. Please send text that contains not more than 900 symbols.')
    }
    let picSize = '200x200'


    if(message.length > 300) {
      picSize = '350x350'
    }else if(message.length > 500){
      picSize = '500x500'
    }

    let url = `http://api.qrserver.com/v1/create-qr-code/?data=${encodeURI(message)}&size=${picSize}`;
    try{
      await axios.get(url)    
      return url;
    }
    catch(e){
      console.log(e)
      return 'Data you sent isn`t valid. Please check that and try again.'
    } 
  }
}
