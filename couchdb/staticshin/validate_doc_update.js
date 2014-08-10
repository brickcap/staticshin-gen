function(newDoc, oldDoc, userCtx, secObj) {
    if(newDoc.title===oldDoc.title){
	throw({duplicate: 'The document is already present'});
    }
}
