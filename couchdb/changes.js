var request = require("request");
var tagDir = ["programming"];
var staticshinWriteDir = "/home/akshat/Repo/staticshin/";

//start listening to couchdb changes and run scripts on them

//console.log("Listening to couchdb changes....");

var staticshinLatest = "http://ABBA:dancing-queen@localhost:5984/test/_changes?descending=true&limit=1&include_docs=true&feed=continous";

request(staticshinLatest,function(error,reponse,body){
       console.log(body);
});
