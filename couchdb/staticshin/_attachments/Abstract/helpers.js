function prepareInitialWorkSpace() {

    var editArea = $("#editArea");
    editArea.autosize();
    return editArea;

}

function hideThis(elements) {

    $(elements.join(',')).hide();
}

function showThis(elements) {
    
    $(elements.join(',')).show();
}

function getMarkdownText() {
    return editArea.val();
}

function getWordCount(text) {
    var strippedText = $('<span>'+text+'</span>').text();
    return strippedText.split(/\s+\b/).length;
}

function setHtmlinPreviewPane(markdownText) {
    wordCountLabel.text('words: ' + getWordCount(markdownText));
    var previewHtml = marked(markdownText);
    previewPaneView.html(previewHtml);
}

function setRawHtml() {

    previewPaneView.text(previewPaneView.html());
}

function setPlain() {
    previewPaneView.html(previewPaneView.text());
}


function getWordCountFromLabel(text) {

    return text.match(/\d+/)[0];
}


function validateInputOnFousOut() {

    var isTitleEmpty = titleContainer.val().trim() === '';
    var isDraftEmpty = editAreaView.val() === '';
    var hasTitileAndDraft = !isTitleEmpty && !isDraftEmpty;
    return hasTitileAndDraft;

}



function getItemsToPost(){
    
    var html = previewPaneView.html();
    var item = {
        
        postHtml: html,
        wordCount :getWordCountFromLabel(wordCountLabel.text()),
        title : titleContainer.val(),
        secret :secret.val(),
	tags : tags.val().split(','),
	postedBy: "Akshat Jiwan Sharma",
	"postedOn": Date.now()
        
    };    
    
    return item;
}

function publishArticle(){
    $.ajax({
	url: "http://localhost:5984/test",
	type: "POST",
	contentType: "application/json", // send as JSON
	data:JSON.stringify(getItemsToPost()),

	complete: function() {
	    //called when complete
	},

	success: function() {
            removeDraft(titleContainer.val());
            window.location.href = "http://localhost:5984/staticshin";
	},

	error: function(data) {
	    alert(data);
	}
    });
    
    // $.post('',getItemsToPost(),function(data){
    //     removeDraft(titleContainer.val());
    //     window.location.href = "http://localhost:5984/staticshin";
    // }).fail(function(data){
    
    // 	if(data.status === 403)alert('un-authorized');
    //     if(data.status===500) alert('internal server error');
    // });
}

function updatePost(){
    
    var items = getItemsToPost();
    items.postedBy = update.data().postedby;
    items.id = update.data().id;
    items.postedOn = update.data().postedon;
    $.post('/updatePost',items,function(data){
        removeDraft(items.title);
        window.location.href = "/"+data.id;
    }).fail(function(data){
	
	if(data.status === 403)alert('un-authorized');
        if(data.status===500) alert('internal server error');
    });
}


var editArea = prepareInitialWorkSpace();

