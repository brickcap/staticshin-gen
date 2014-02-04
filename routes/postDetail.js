var constants = require('../constants');
var request = require('request');
var mustache = require("mustache");
var fs = require("fs-extra");

exports.postDetail = function(req,res){
  
    var id = req.params.id;
    var url = constants.queries.postType()+id;
    request(url,function(error,response,body){
        try{
        var parsed = JSON.parse(body);      
        parsed._source.postedOn = new Date(parsed._source.postedOn).toDateString();
	    var temp =  fs.readFileSync('views/post_template.html');
	    var render =mustache.render(temp.toString(),parsed);
	    fs.outputFileSync('/home/akshat/Desktop/EVERYTHING/Repo/staticshin/'+parsed._id+'/index.html',render);	
	    return res.render(constants.views.postDetail,parsed);
        }
        catch(e){
            
            return res.send(404);
        }
    });
    
};
