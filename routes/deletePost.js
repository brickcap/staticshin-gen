var constants = require('../constants');
var request = require('request');
var helpers = require('../helpers');
var rimraf = require("rimraf");
var urlUtil = require("url");

exports.getPostToDelete = function(req,res){
    
    var id = req.params.id;
    var url = constants.queries.postType()+id;
    request(url,function(error,response,body){
        var parsed = JSON.parse(body);
        if(error)return res.send(404);
        if(parsed.error) return res.send(404);
        return res.render(constants.views.deletePost,buildResponse(parsed));
    });
};

exports.deletePost = function(req,res){
    var pathName = urlUtil.parse(req.body.url).pathname ;
    var reqPath = pathName.substring(0,pathName.indexOf("/d")); 
    var id = req.body.id;
    var secret = req.body.secret;
    var url = constants.queries.postType()+id;
    var contributor = helpers.getContributor.getRoleFromSecret(secret,constants.contributors);
    var tags = req.body.tags;
    if(!helpers.authorization.isUserAuthorized(contributor,req.body.postedBy)) return res.send(403);
    request.del(url,function(error,response,body){
        
        if(error) return res.send(500);
	console.log(reqPath);
	//issacs rimraf module
	if(tags){
	    tags.forEach(function(element,index,arr){
		rimraf("/home/akshat/Repo/staticshin/"+element+reqPath,function(err){
		    console.log(err);
		}); 
	    });
	}
	rimraf("/home/akshat/Repo/staticshin"+reqPath,function(err){
	    console.log(err);
	});
        return res.send(200);
    });
    return null;
};

function buildResponse(postDetail){
    var data = {};
    data.id = postDetail._id;
    data.title = postDetail._source.title;
    data.wordCount = postDetail._source.wordCount;
    data.postedBy = postDetail._source.postedBy;
    data.tags = postDetail._source.tags;
    return data;    
}
