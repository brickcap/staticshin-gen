var request = require("request");
var _ = require("underscore");

var importer = function(){
    //reading all data from elastic search

    request("http://localhost:9200/blog/_search?size=100",function(error,response,data){
	var parsed = JSON.parse(data);
	var hits = _.pluck(parsed.hits.hits,"_source");
	//pushing it to couch :)
	request.post("http://localhost:5984/staticshin/_bulk_docs",
		     {json:{"docs":hits}},
		     function(error,response,data){
			 console.log(data);
		     });
    });

};

importer();



