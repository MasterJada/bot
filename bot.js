var TelegramBotApi = require('node-telegram-bot-api')
var db = require('./db')
var token = "937074570:AAEydYJbz4U2Q6cqLM_YTiK1UjjYpTWRgMA";
const tBot = new TelegramBotApi(token, {polling: true});

tBot.onText(/\/subscribe (.+)/, (msg, match) =>{
    const chatId = msg.chat.id
    var projectID =  match[1]
    if(match[1]){ 
       db.subscribeToProject({chatId: chatId}, projectID, (response) =>{
         tBot.sendMessage(chatId, "Ты подписан на проект "+ response.name)
       })
    }
    
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