Usages
===

    var editor = new MarkdownEditor({
        'width': '100%',
        'height': '100%',
        'selector': 'body',
        'callback': function() {
            alert('Markdown editor')
        }
    }).init();

You can install this module use npm

    npm install zjs_markdown_editor

Selector may be jQuery selectors

Texts would auto save in your localStorage

You can get markdown text from localStorage or call the function
    
    editor.getMarkDownText()

clear localStorage
    
    editor.clearStorage()

Image Upload

You can upload your own image to your service.

Init your options like
    
    var editor = new MarkdownEditor({
        'width': '100%',
        'height': '100%',
        'selector': 'body',
        'upload_url': '/upload/'
        'upload_result_data': 'url',
        'callback': function() {
        }
    }).init();

upload_url option is your service upload api, upload_result_data is your api return data struct type.

Depends on jQuery, jquery.caret.js, showdown

Live Demo : [https://wang125309.github.io/zjsmarkdowneditor.github.io/][1]

  [1]: https://wang125309.github.io/zjsmarkdowneditor.github.io/
