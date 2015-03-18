var feedBuilder = require('feed');
var request = require('request');
var preferences = require('../preferences').preferences;
var helpers = require('../helpers');
var constants = require('../constants');

var feedPref = preferences.feed;

exports.get_tagged_feeds = function(){
    for(var key in preferences.whitelist){
	console.log(JSON.stringify(getRecentFeedsQuery(key)));
    }
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
