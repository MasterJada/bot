//FR!dw2p!M9BeAaX
//bot
var mongoose = require('mongoose');
mongoose.connect('mongodb://bot:FR!dw2p!M9BeAaX@ds111370.mlab.com:11370/heroku_xdppzrk4', {useNewUrlParser: true});

var Schema = mongoose.Schema;
var project_schema = new Schema({
    name: String, 
    lastLink: String,
    subscribers: [String]
})

var subscribers_schema = new Schema({
    chatId: String
})

var Project =  mongoose.model("Project", project_schema)
var Subscriber = mongoose.model("Subscriber", subscribers_schema)



module.exports.getAllProjects = function(callback){
    Project.find((err, prjs)=>{
        if(err) return []
        console.log(prjs);
        callback(prjs)
    })
}
module.exports.addProject = function(prject, callback){
    var prj = new Project(prject)
    prj.save(function (err, doc) {
        if (err) return console.log(err);
        module.exports.getAllProjects(callback)
      });
}
module.exports.deleteProject = function(id, callback){
    Project.deleteOne({_id: id}, function(err){
        if(err)return console.log(err);
        module.exports.getAllProjects(callback)
    })
}

module.exports.subscribeToProject = function(subscriber,prjID, callback){
    var subs = new Subscriber(subscriber)
    subs.save((err, usr) =>{
        if(err) return console.log(err);
        Project.findOne({_id: prjID},(err, project) =>{
            if(err)return console.log(err);
            if(!project.subscribers.includes(subscriber.chatId)){
                project.subscribers.push(subscriber.chatId)
                project.save((err, saved) =>{
                    callback(saved)   
                })
                
            }
        })
    })
}
module.exports.unsubscribeFromProject = function(chatId, prjID, callback){
    Project.findOne({_id: prjID}, (err, project) =>{
        if(err)return console.log(err);
        var index = project.subscribers.indexOf(chatId)
        if (index > -1) {
            project.subscribers.splice(index, 1);
          }
        callback()  
    })
}

module.exports.getSubscribers = function(prjID, callback){
    Project.findOne({_id: prjID},(err, project) => {
        if(err) return console.log(err);
        callback(project.subscribers)
    })
}

var db =  mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected");
});

module.exports.db = db