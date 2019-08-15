var TelegramBotApi = require('node-telegram-bot-api')
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var request = require('request');

var db = require('./db')
app.use(express.static("front"))
app.use(bodyParser.urlencoded({ extended: false }))

var token = "937074570:AAEydYJbz4U2Q6cqLM_YTiK1UjjYpTWRgMA";
const tBot = new TelegramBotApi(token, {polling: true});
const subscribers = [];

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

  app.post("/test",(req, resp) =>{
    console.log(req.body.url);
    resp.send("Hello!")
  });

  app.post('/deploy', (req, resp) =>{
      var url = req.body.url;
      var project = req.body.tokent;
      if(url){
        request(url , { json: true }, (err, res, body) => {
          if (err) { return console.log(err); }
          body.forEach(element => {
            var url = element.url
            if(url.endsWith('apk')){
              db.getSubscribers(project, (subscribers) =>{
                subscribers.forEach(chatId => 
                  tBot.sendMessage(chatId, url))
              })
            }
          });
        });
      }
      resp.json({'status': 'ok'})
  });

  app.get("/",(req, resp) =>{
      resp.sendFile(__dirname+"/front/main.html")
  });

  app.get("/projects", (req, resp) =>{
    db.getAllProjects((projects)=>{
      if(projects){ 
        resp.json(projects)
      }else{
        resp.json([])
      }
    })
  });

  app.post("/addproject", (req, resp)=>{
    var project = {name: req.body.name} 
    if(project){
      db.addProject(project, (callback) =>{
        resp.json(callback)
      })
    }
  });

  app.post("/deleteproject", (req, resp) =>{
    db.deleteProject(req.body.id, (callback) => {
        resp.json(callback)
    })
  });

 app.post("/subscribe", (req, resp) =>{
   db.subscribeToProject({chatId: req.body.id}, req.body.prjID, (callback) =>{
    resp.json(callback)
   })
 });
  
var port = process.env.PORT || 4000;
app.listen(port,()=> {
  console.log("Server run on " + port);
})

 

  //curl -d "url=https://google.com" -X POST http://localhost:4000/test
  //curl -d "url=https://circleci.com/api/v1.1/project/github/Mas/20/artifacts?circle-token=7971292077885be4d63a38abd0d79eef2b8d0d8d" -X POST https://olegscdbot.herokuapp.com/deploy

//curl -d "url=https://circleci.com/api/v1.1/project/github/MasterJada/TestApp/20/artifacts?circle-token=7971292077885be4d63a38abd0d79eef2b8d0d8d" -X POST https://olegscdbot.herokuapp.com/deploy