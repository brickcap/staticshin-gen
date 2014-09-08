var request = require('request');
var consolidate = require('consolidate');
var mustache = require('mustache');
var fs = require('fs-extra');
var whitelist = require("./preferences").preferences.whitelist;

var renderString = fs.readFileSync("/home/akshat/Repo/staticshin/about.html");
var header = fs.readFileSync("/home/akshat/Repo/staticshin-gen/views/header.html");
var rendered = mustache.render(renderString.toString(),{head:header});

fs.outputFileSync('/home/akshat/Repo/staticshin/about.html',rendered);

request("http://localhost:9200/blog/_search?size=79",function(error,response,body){
    var parsed = JSON.parse(body);
    var hits = parsed.hits.hits;
    //console.log(hits[0]);
    var i=0;
    for(i;i<hits.length;i++){
	var hit = hits[i];
	var id = hit._id;
	
	hit._source.postedOn = new Date(hit._source.postedOn).toDateString();	
	var temp =  fs.readFileSync('views/post_template.html');
	//console.log(hit._source);
	var header = fs.readFileSync('views/header.html');
	hit.header = header;
	var render =mustache.render(temp.toString(),hit);
	if(hit._source.tags){
	    var tags = hit._source.tags;
	    tags.forEach(function(tag){
		if(whitelist.hasOwnProperty(tag)){
		    console.log("tag rendering at: " +whitelist[tag]+id+'/index.html');
		    
		    fs.outputFileSync(whitelist[tag]+id+'/index.html',render);
		}
	    });
	};
	fs.outputFileSync('/home/akshat/Repo/staticshin/'+id+'/index.html',render);
	
    }
});

