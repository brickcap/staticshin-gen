function(newDoc, oldDoc, userCtx, secObj) {
    if(!oldDoc)return true;
    if(oldDoc && newDoc.title===oldDoc.title){
	throw({forbidden: 'The document is already present'});
    }
    else{
	return true;
    }
}
