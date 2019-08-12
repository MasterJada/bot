var TelegramBotApi = require('node-telegram-bot-api')
var http = require('http');
var fs = require('fs');
var request = require('request');

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

  var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);
            
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };
  // var port = process.env.PORT || 4000;
  // http.createServer((req, resp) =>{
  //   resp.writeHead(200, {'Content-Type': 'text/html'});
  //   resp.end('Hello World!');
  // }).listen(port)


  tBot.onText(/\unsubscribe/, (msg)=>{
        const chatId = msg.chat.id
        for(var i = 0; i< subscribers.length;  i++){
            if(subscribers[i] == chatId){
                subscribers.splice(i, 1)
            }
            console.log(subscribers);
        }
  });