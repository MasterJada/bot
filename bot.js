var TelegramBotApi = require('node-telegram-bot-api')
var db = require('./db')
var token = "937074570:AAEydYJbz4U2Q6cqLM_YTiK1UjjYpTWRgMA";
const tBot = new TelegramBotApi(token, {polling: true});

tBot.onText(/\/subscribe/, (msg, match) =>{
    const chatId = msg.chat.id
   let reg = RegExp(/^[0-9a-fA-F]{24}$/)
    tBot.sendMessage(chatId, "Скажи мне токен проекта")
    .then(message =>{
      console.log("Wait for message");
      tBot.onText(reg, (msg) =>{
        console.log(msg.text);
        db.subscribeToProject({chatId: chatId}, msg.text, (err, response) =>{  
              if (err) {
                if(err == 418) {
                  tBot.sendMessage(chatId, "Ты уже подписан на этот проект")
                  tBot.removeTextListener(reg)
                }
                if(err == 404) tBot.sendMessage(chatId, "Проект не найден, уточни токен и отправь его снова")
                return
              }
                tBot.sendMessage(chatId, "Ты подписан на проект "+ response.name)
                tBot.removeTextListener(reg)
           })
       
      })
    })
 });
 
 tBot.onText(/\unsubscribe/, (msg)=>{
   const chatId = msg.chat.id
   for(var i = 0; i< subscribers.length;  i++){
       if(subscribers[i] == chatId){
           subscribers.splice(i, 1)
       }
       console.log(subscribers);
   }
});

module.exports.tBot = tBot