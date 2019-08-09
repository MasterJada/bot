var TelegramBotApi = require('node-telegram-bot-api')
var token = "937074570:AAEydYJbz4U2Q6cqLM_YTiK1UjjYpTWRgMA"
const tBot = new TelegramBotApi(token, {polling: true})
const subscribers = []

  tBot.onText(/\/subscribe/, (msg) =>{
     const chatId = msg.chat.id
     subscribers.push(chatId)
     console.log(subscribers);
        tBot.sendMessage(chatId, "Теперь ты будешь получать обновы")
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