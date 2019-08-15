
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var request = require('request');
var fs = require('fs')
var replace = require('buffer-replace');

var db = require('./db')
var tBot = require('./bot')
app.use(express.static("front"))
app.use(bodyParser.urlencoded({ extended: false }))


  app.post("/test",(req, resp) =>{
    console.log(req.body.url);
    resp.send("Hello!")
  });

  app.post('/deploy', (req, resp) =>{
      var url = req.body.url;
      var project = req.body.token;
      console.log(url);
      console.log(project);
      if(url){
        request(url , { json: true }, (err, res, body) => {
          if (err)  return console.log(err);
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
  
app.get('/config.yml', (req, resp) =>{
    var prjID = req.query.id
    if(!prjID) return resp.sendStatus(404)
   fs.readFile(__dirname +"/config.txt", (err, data) =>{
     resp.send(replace(data, "[token]", prjID))
   })
})

var port = process.env.PORT || 4000;
  app.listen(port,()=> {
    console.log("Server run on " + port);
})


 

  //curl -d "url=https://google.com" -X POST http://localhost:4000/test
  //curl -d "url=https://circleci.com/api/v1.1/project/github/Mas/20/artifacts?circle-token=7971292077885be4d63a38abd0d79eef2b8d0d8d" -X POST https://olegscdbot.herokuapp.com/deploy

//curl -d "url=https://circleci.com/api/v1.1/project/github/MasterJada/TestApp/20/artifacts?circle-token=7971292077885be4d63a38abd0d79eef2b8d0d8d&token=5d550b34eb455c7f90746f06" -X POST https://olegscdbot.herokuapp.com/deploy