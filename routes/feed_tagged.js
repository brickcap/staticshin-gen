var feedBuilder = require('feed');
var request = require('request');
var preferences = require('../preferences').preferences;
var helpers = require('../helpers');
var constants = require('../constants');
var fs = require("fs");
var feedPref = preferences.feed;

exports.get_tagged_feeds = function(req,res){
    for(var key in preferences.whitelist){
	(function(key){
	    var type = req.params.type;
	    var url = constants.queries.search();
	    var headers = helpers.setHeaders(url,getRecentFeedsQuery(key));
	    var atomPreferred = feedPref.atom;
	    var rssPreferred = feedPref.rss;
	    request(headers,function(error,response,body){
		var path = preferences.whitelist[key];
		console.log(path);
		var feed = buildFeed(key);
		buildResponse(body.hits.hits,feed,key);
		var rss_render = feed.render("rss-2.0");
		var atom_render = feed.render('atom-1.0');
		fs.writeFileSync(path+'/rss.xml',rss_render);
		fs.writeFileSync(path+'/atom.xml',atom_render);

	    });
	})(key);
    }
    return res.send(200);
};
function getRecentFeedsQuery(tag){
    
    var queryData = {
	"sort" :{ "postedOn" : {"order" : "desc"}},
	"fields" :["postedOn","title","postedBy","postHtml"],
	"from" : 0,
	"query":{
	    "bool":{
		"must":{
		    "terms":{"tags":[tag]}
		}
	    }
        },
	"size" : 100
    };
    
    return queryData;
}

function buildResponse(data,feed,tag){
    
    for(var i = 0; i<data.length;i++){
	
	var item = data[i];
	
	feed.item({
	    
	    title : item.fields.title,
	    link: tag==="wrinq"?"http://www.wrinq.com/blog"+item._id:feedPref.link+tag+"/"+item._id,
	    description : helpers.getPostSummary(item.fields.postHtml,feedPref.summaryLength),
	    author : [
		{
		    name : item.fields.postedBy
		}			
		
	    ],
	    date :new Date(item.fields.postedOn)		
	    
	});
    }
    
    
}
function buildFeed(tag){
   
    var feed = new feedBuilder({
	
    	title:feedPref.title,
	
    	description:feedPref.description,
	
    	link:tag==="wrinq"?"http://www.wrinq.com/":feedPref.link,
	
	author : feedPref.author
	
    });
    return feed;
}
