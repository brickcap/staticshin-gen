exports.preferences = {
	// reference :	https://github.com/brislink/specter/wiki/preferences-documentation 	 
	
	"databaseUrl"   :"http://localhost:9200/",
	"searchResults" :5,
	
	"index" : {
	
	"pageFields":["postedBy","postedOn","title","wordCount"],
	"summaryLength" : 0,
	"paginationSize" :11
		
	},
	
	"searchIndex" : {
		
	"pageFields" : ["postedBy","postedOn","title","wordCount","postHtml"],
	"summaryLength" : 2,
	"paginationSize" : 11
},

"tagIndex" : {
		
	"pageFields" : ["postedBy","postedOn","title","wordCount","postHtml"],
	"summaryLength" : 2,
	"paginationSize" : 11
},	

	
"feed" : {
	
	"rss" : true,
	"atom" : true,
	"paginationSize" : 10,
	"title" : '',
	"description" : '',
	"link" : 'http://www.staticshin.com/',
	"summaryLength" : 2,
	 author: {
        'name':       'Akshat Jiwan Sharma',
        'email':      'akshat_fullmetal@yahoo.co.in',
        'link':       'http://www.staticshin.com/'
    }	
}	
};

