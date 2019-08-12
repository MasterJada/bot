var TelegramBotApi = require('node-telegram-bot-api')
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var request = require('request');

app.use(bodyParser.urlencoded({ extended: false }))

var token = "937074570:AAEydYJbz4U2Q6cqLM_YTiK1UjjYpTWRgMA";
const tBot = new TelegramBotApi(token, {polling: true});
const subscribers = [];

  tBot.onText(/\/subscribe/, (msg) =>{
     const chatId = msg.chat.id
     subscribers.push(chatId)
     console.log(subscribers);
        tBot.sendMessage(chatId, "Теперь ты будешь получать обновы")
  });
  
  tBot.onText(/link/, (msg)=>{
    const chatId = msg.chat.id
    tBot.sendMessage(chatId, "Okay")
    //"https://18-171504908-gh.circle-artifacts.com/0/apks/release/TestApp%201%201.0-release.apk"
    
        download("https://18-171504908-gh.circle-artifacts.com/0/apks/release/TestApp%201%201.0-release.apk",
        "lastBuild.apk", ()=>{
            tBot.sendDocument(chatId, fs.createReadStream("lastBuild.apk"))
        })
  });

  app.post("/test",(req, resp) =>{
    console.log(req.body.url);
    resp.send("Hello!")
  })

  app.get("/",(req, resp) =>{
      resp.send("<h1>Ok it's works</h1>")
  })

var port = process.env.PORT || 4000;
app.listen(port,()=> {
  console.log("Server run on " + port);
})

  tBot.onText(/\unsubscribe/, (msg)=>{
        const chatId = msg.chat.id
        for(var i = 0; i< subscribers.length;  i++){
            if(subscribers[i] == chatId){
                subscribers.splice(i, 1)
            }
            console.log(subscribers);
        }
  });

  //curl -d "url=google.com" -X POST http://localhost:4000/test
