var request = require('request');
var helpers = require('../helpers');
var constants = require('../constants');
var mustache = require('mustache');
var fs = require("fs-extra");
var whitelist = require("../preferences").preferences.whitelist;
var _ = require("underscore");
var blacklist = ["wrinq"];

exports.getArchives = function(req,res,api){
    request(buildArchivesQuery(),function(error,response,body){

	if(error||!body) res.send(500);
	var data =  buildResponse(body.hits.hits);
	

	if(api){return res.json(data);}
	var temp =  fs.readFileSync('views/archives_template.html');
	var header = fs.readFileSync('views/header.html');
	data.header = header;
	var render =mustache.render(temp.toString(),data);
	fs.outputFileSync("/home/akshat/Repo/staticshin/archives.html",render);
	//now build archives for tags
	var uniqueTags = data.archiveTags;
	uniqueTags.forEach(function(element,index,arr){
	    
	    if(!whitelist.hasOwnProperty(element))return;
	    var tagRenderData = _.filter(data.archives,function(data){
		if(data.fields.hasOwnProperty("tags")) {
		    return data.fields.tags.indexOf(element)>-1;
		}
		return false;
	    });
	    var tagTemp = fs.readFileSync(whitelist[element]+element+"_index.html");
	    var tagRender = mustache.render(tagTemp.toString(),{archives:tagRenderData,header: header,tag:element});
	    fs.outputFileSync(whitelist[element]+"index.html",tagRender);
	    
	});
	
	return res.render(constants.views.archives,data);
    });

};

function buildArchivesQuery(){

    var query = {
	"fields": ["postedBy","postedOn","title","wordCount","tags"],
	"size" : 1000000,
	"sort" :{ "postedOn" : {"order" : "asc"}},
	"query" : {

	    "match_all" :{}
	}
	
    };

    var url = constants.queries.search();
    var headers = helpers.setHeaders(url,query);
    return headers;
}

function buildResponse(data){
    
    var uniqueTags = [];

    data.forEach(function(item){

	item.fields.postedOn = new Date(item.fields.postedOn).toDateString(); 
	
	if(!item.fields.tags){return item;}
	var intersection = item.fields.tags.filter(
	    function(tag){
		
		return uniqueTags.indexOf(tag)<0;
	    });
	
	uniqueTags.push.apply(uniqueTags,intersection);
	item.fields.tags.forEach(function(tag,index,arr){
	    if(whitelist.hasOwnProperty(tag)){
		console.log("found");
		item.urlTag=tag;
		console.log(item);
	    }
	});
	return item;
    });
    var data_true = _.reject(data,function(data){
	var data_tags = data.fields.tags;
	
	if(!data_tags)return false;
	if(data_tags){

	    var pure_tags = _.intersection(data_tags,blacklist);
	    console.log(pure_tags);
	    return pure_tags.length===blacklist.length?true:false;
	}	
    });
    
    
    return {archives:data,archiveTags: uniqueTags,render_data:data_true};
}
