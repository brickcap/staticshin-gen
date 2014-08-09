var request = require("request");
var tagDir = ["programming"];

//start listening to couchdb changes and run scripts on them

console.log("Listening to couchdb changes....");
var staticshinLatest = "http://ABBA:danging-queen@localhost:5984/test?descending=true&limit=1&include_docs=true";

request(staticshinLatest,function(error,reponse,body){
    console.log(body);
});
