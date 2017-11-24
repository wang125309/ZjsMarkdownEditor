Usages
===

    var editor = new MarkdownEditor({
        'width': '100%',
        'height': '100%',
        'selector': 'body'
    }).init();

Selector may be jQuery selectors

Texts would auto save in your localStorage

You can get markdown text from localStorage or call the function
    
    editor.getMarkDownText()

Depends on jQuery, jquery.caret.js, showdown 
