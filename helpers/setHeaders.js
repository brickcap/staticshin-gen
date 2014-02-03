var constants = require('../constants');

exports.setHeaders = function(url,data){
    
    var headers = {
        
        url: url,
        body: data,
        method : 'POST',
        json : true
    };
    
    return headers;
};