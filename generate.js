var request = require('request');
var consolidate = require('consolidate');
var mustache = require('mustache');
var fs = require('fs-extra');
var whitelist = require("./preferences").preferences.whitelist;
var argument = process.argv[2];
var url = argument?"http://localhost:9200/blog/_search?pretty=true&q=tags:"+argument:
    "http://localhost:9200/blog/_search?size=100000";

renderAbout();

request(url,function(error,response,body){
    console.log(argument);
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
	var tags = hit._source.tags;
	var untaggedCriteria = tags&&tags.length===0&&!argument||!tags;
	//First handle the rendering of tagged files
	if(tags&&tags.length>0){
	     tags.forEach(function(tag){
		 var render =mustache.render(temp.toString(),hit);		    
		 if(whitelist.hasOwnProperty(tag)){
		     console.log("tag rendering at: " +whitelist[tag]+id+'/index.html');
		     hit.urlTag = true;
		     fs.outputFileSync(whitelist[tag]+id+'/index.html',render);
		 }
		 if(!whitelist.hasOwnProperty(tag)){
		     console.log("rendering tagged blacklisted post "+i.toString());
		     fs.outputFileSync('/home/akshat/Repo/staticshin/'+id+'/index.html',render);

		 }
	    });
	}
	// okay now no more tags are left. Render away
	
	//if there are tags the length must be zero other wise tags can be undefined. 
	//There should be no arguments supplied by the command line as well

	if(untaggedCriteria){
	    console.log("rendering untagged post "+i.toString());
	    var render =mustache.render(temp.toString(),hit);
	    fs.outputFileSync('/home/akshat/Repo/staticshin/'+id+'/index.html',render);
	}
	
    }
});


function renderAbout(){
var aboutRenderString = fs.readFileSync("/home/akshat/Repo/staticshin/about.html");
var header = fs.readFileSync("/home/akshat/Repo/staticshin-gen/views/header.html");
var rendered = mustache.render(aboutRenderString.toString(),{header:header});
fs.outputFileSync('/home/akshat/Repo/staticshin/about.html',rendered);
console.log("about page rendered");
}
