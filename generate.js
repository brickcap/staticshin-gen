var request = require('request');
var consolidate = require('consolidate');
var fs = require('fs');

request("http://localhost:9200/blog/_search?size=74",function(error,response,body){
    var parsed = JSON.parse(body);
    var hits = parsed.hits.hits;
    var i=0;
    for(i;i<hits.length;i++){

	fs.mkdir('../staticshin/'+hits[i]._id,function(err){
	   console.log(err);
	    if(err&&!hits[i])return;
	    var item = hits[i]._source;
	    item.date = new Date(item.date).toDateString();
	    console.log(i);
	    consolidate.mustache('../views/post_template.html',item,function(err,html){
	//	console.log(i);
		fs.writeFile("index.html",html);
	    });
	});
    }
});
