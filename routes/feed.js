var feedBuilder = require('feed');
var request = require('request');
var preferences = require('../preferences').preferences;
var helpers = require('../helpers');
var constants = require('../constants');
var fs = require("fs");
var feedPref = preferences.feed;



exports.getFeeds = function(req,res){
    
    var type = req.params.type;
    var url = constants.queries.search();
    var headers = helpers.setHeaders(url,getRecentFeedsQuery());
    var atomPreferred = feedPref.atom;
    var rssPreferred = feedPref.rss;
    
    if(!(rssPreferred||atomPreferred)){return res.send(404);};
    
    request(headers,function(error,response,body){
	
	if(error||body.error) return res.send(500);

	var rss_render = feed.render('rss-2.0');
	var atom_render = feed.render('atom-1.0');
	var feed = buildFeed();
	buildResponse(body.hits.hits,feed);
	fs.writeFileSync('/home/akshat/Repo/staticshin/rss.xml',rss_render);
	fs.writeFileSync('/home/akshat/Repo/staticshin/atom.xml',atom_render);
	
	if(type === 'rss'&& rssPreferred){ 
	    res.set('Content-type','application/rss+xml');
	    return res.send(rss_render);
	}
	if(type === 'atom' && atomPreferred){
	    res.set('Content-type','application/atom+xml');
	    return res.send(atom_render);
	}
	return res.send(404);
    });
    return null;	
};

function buildFeed(){

    var feed = new feedBuilder({
	
    	title:feedPref.title,
	
    	description:feedPref.description,
	
    	link:feedPref.link,
	
	author : feedPref.author
	
    });
    return feed;
}

function getRecentFeedsQuery(){
    
    var queryData = {
	"sort" :{ "postedOn" : {"order" : "desc"}},
	"fields" :["postedOn","title","postedBy","postHtml"],
	"from" : 0,
	"query":{
	    "bool":{
		"must_not":{
		    "terms":{"tags":["wrinq"]}
		}
	    }
        },
	"size" : 10
    };
    
    return queryData;
}

function buildResponse(data,feed){
    
    for(var i = 0; i<data.length;i++){
	
	var item = data[i];
	
	feed.item({
	    
	    title : item.fields.title,
	    link: feedPref.link + item._id,
	    description : helpers.getPostSummary(item.fields.postHtml,feedPref.summaryLength),
	    author : [
		{
		    name : item.fields.postedBy
		}			
		
	    ],
	    date : 	new Date(item.fields.postedOn)		
	    
	});
    }
    
    
}
