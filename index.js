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
  
  tBot.onText(/\unsubscribe/, (msg)=>{
    const chatId = msg.chat.id
    for(var i = 0; i< subscribers.length;  i++){
        if(subscribers[i] == chatId){
            subscribers.splice(i, 1)
        }
        console.log(subscribers);
    }
});

  app.post("/test",(req, resp) =>{
    console.log(req.body.url);
    resp.send("Hello!")
  });

  app.post('/deploy', (req, resp) =>{
      var url = req.body.url;
      if(url){
        request(url , { json: true }, (err, res, body) => {
          if (err) { return console.log(err); }
          body.forEach(element => {
            var url = element.url
            if(url.endsWith('apk')){
              subscribers.forEach(chat => {
                tBot.sendMessage(chat, url)
              });
            }
          });
        });
      }
      resp.json({'status': 'ok'})
  });

  app.get("/",(req, resp) =>{
      resp.send("<h1>Ok it's works</h1>")
  })

var port = process.env.PORT || 4000;
app.listen(port,()=> {
  console.log("Server run on " + port);
})

 

  //curl -d "url=https://google.com" -X POST http://localhost:4000/test
  //curl -d "url=https://circleci.com/api/v1.1/project/github/MasterJada/TestAppircle-token=7971292077885be4d63a38abd0d79eef2b8d0d8d" -X POST https://olegscdbot.herokuapp.com//deploy
