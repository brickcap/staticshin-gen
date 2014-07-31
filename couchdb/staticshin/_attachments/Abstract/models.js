var draft = function (parsed, title) {

        var self = this;
		var wordCount = parsed.wordCount;
        self.date = new Date(parsed.time).toDateString();
        self.count = wordCount;
        self.title = title;
        self.plural = wordCount > 1;
        self.trueDate = new Date(parsed.time);

    };

    var viewModel = function (drafts) {

        var self = this;
        self.drafts = ko.observableArray(drafts);
        self.showEditor = ko.observable(true);
        self.showTitle = ko.observable(true);
        self.raw = ko.observable(true);
        self.currentKey = '';

        self.clearCurrentWorkSpace = function(){
            self.currentKey = '';
            titleContainer.val('');
            editArea.val('');
        };
        
        self.deleteDraft = function (draft, event) {

            self.clearCurrentWorkSpace();
            event.stopPropagation();
            removeDraft(draft.title);
            self.drafts.remove(draft);

        };

        self.showDrafts = function () {
			
			self.saveAndNotify();
			previewContainerView.hide();
            self.showEditor(false);			
            self.showTitle(false);
            renderSavedDrafts();            
			$("#tags_tagsinput").hide();
			draftsView.show();
			saveAndPreview.hide();
        };

        self.newDraft = function () {
			self.saveAndNotify();
            hideThis([previewContainerExpression,draftsExpression]);
            self.clearCurrentWorkSpace();
editArea.trigger('autosize');
            self.showTitle(true);
            self.showEditor(true);
            titleContainer.val('');
			$("#tags_tagsinput").show();
			saveAndPreview.show();
        };

        self.showPreview = function () {				
			
            if (validateInputOnFousOut()) {
				
				saveAndPreview.hide();
                setHtmlinPreviewPane(getMarkdownText());
		 plainViewButton.hide();
                self.showEditor(false);
                self.showTitle(true);
                showThis([rawHtmlExpression,previewContainerExpression]);
                self.saveAndNotify();
				$("#tags_tagsinput").show();
				$("#tags_tagsinput").on('click',function(event){event.stopPropagation()});
            }

        };

        self.hidePreview = function () {
			
            previewContainerView.hide();
            self.showEditor(true);
            editArea.trigger('autosize');
            editArea.focus();
			$("#tags_tagsinput").hide();
			saveAndPreview.show();
        };

        self.editDraft = function (draft) {

            var title = draft.title;
            var item = getDraftFromKey(title);
            var parsed = JSON.parse(item);
            draftsView.hide();
            editArea.val(parsed.text).trigger('autosize');
            titleContainer.val(title);
            self.currentKey = title;
            wordCountLabel.text(parsed.wordCount);
            self.showEditor(true);
            self.showTitle(true);
			$("#tags").importTags(parsed.tags);
			$("#tags_tagsinput").hide();
			saveAndPreview.show();
        };
        
        
        self.rawHtml = function(data,event){

            setRawHtml();
        event.stopPropagation();
        self.raw(false);

        };

        self.plain = function(data,event){

        setPlain();
        event.stopPropagation();
        self.raw(true);

        };
        
        
        self.editingSecret = function(data,event){
            
            event.stopPropagation();
        };
        
       

        
        self.publishArticle = function(data,event){
            event.stopPropagation();
            publishArticle();
        };
        
        self.updateArticle = function(data,event){
            event.stopPropagation();
            updatePost();
        };
        
        self.saveAndNotify = function(){
		if(!editArea.val() || !titleContainer.val()) return;			
             saveCurrentDraft(self.currentKey);
            saveStatusNotification.fadeIn().show().delay(1000).fadeOut();
        };
        
        self.editTitle = function(){
            self.currentKey = titleContainer.val();
            previewContainerView.hide();
            self.showEditor(true);
			$("#tags_tagsinput").show();
        }
    };

    var initializeDrafts = new viewModel();
    ko.applyBindings(initializeDrafts);
