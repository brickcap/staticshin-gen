var constants = require('../constants');
var request = require('request');
var mustache = require("mustache");
var fs = require("fs-extra");
var whitelist = require("../preferences").preferences.whitelist;

exports.postDetail = function(req,res){
    
    var id = req.params.id;
    var url = constants.queries.postType()+id;
    request(url,function(error,response,body){
        try{
            var parsed = JSON.parse(body);      
            parsed._source.postedOn = new Date(parsed._source.postedOn).toDateString();
	    var temp =  fs.readFileSync('views/post_template.html');
	    var header = fs.readFileSync('views/header.html');
	    parsed.header = header;
	    var render =mustache.render(temp.toString(),parsed);
	    if(parsed._source.hasOwnProperty("tags")){
		parsed._source.tags.forEach(function(element,index,arr){
		    if(whitelist.hasOwnProperty(element)){
			console.log("yes");
			fs.outputFileSync(whitelist[element]+parsed._id+"/index.html",render);
			
		    }
		});
		return res.render(constants.views.postDetail,parsed); 

	    }
	    else{

		fs.outputFileSync('/home/akshat/Repo/staticshin/'+parsed._id+'/index.html',render);		
		return res.render(constants.views.postDetail,parsed);
	    }
        }
        catch(e){
            
            return res.send(404);
        }
	return null;
    });
    
};
