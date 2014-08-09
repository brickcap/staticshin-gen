var request = require("request");


//start listening to couchdb changes and run scripts on them

var staticshinLatest = "http://ABBA:danging-queen@localhost:5984/staticshin?descending=true&limit=1&include_docs=true";

request(staticshinLatest,function(error,reponse,body){
});
