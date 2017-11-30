var $ =require('jquery');
require('jquery.crate');
var showdown = require('showdown');

(function(){
    "use strict"
    
    var BLOD = '粗体';
    var ITALIC = '斜体';
    var A = '链接地址';
    var quote = '段落引用';
    var CODE = '代码';
    var TITLE = '标题';
    var IMAGE = '图片描述';
    var LINE = '线';
    var LAST_STEP = '上一步';
    var NEXT_STEP = '下一步';
    var CANCLE = '取消';
    var CONFIRM = '确定';
    var QUEUE_LENGTH = 200;
    var first_open = 0;

    var converter = new showdown.Converter();

    var action_queue_last = [];
    var action_queue_next = [];

    var MarkdownEditor = function(params) {
        var obj = new Object();
        var _a_menu = null;
        var _image_menu = null;
        obj.selector = ('selector' in params? params.selector: 'body');
        obj.width = ('width' in params? params.width: '100%');
        obj.height = ('height' in params? params.height: '100%');
        obj.events = ['blod', 'italic', 'a', 'quote', 'code', 'title', 'title1', 'title2', 'line', 'image', 'last', 'next']; 
        obj.tools = ('tools' in params? params.tools: null);
        obj.setTools = function() {
            if (null != obj.tools) {
                for(var ele in obj.tools) {
                    $('.markdown-toolbar').append(obj.tools[ele]);
                }
            };
        };
        obj.wrapper = function() {
            var html = '<div class="markdown-wrapper" style="width:' + obj.width+';height:' + obj.height+';">' +
                    '<div class="markdown-toolbar">' + 
                        '<div class="tool image-tool"></div>' +
                        '<div class="tool quote"></div>' +
                        '<div class="tool a"></div>' +
                        '<div class="tool blod"></div>' +
                        '<div class="tool italic"></div>' +
                        '<div class="tool code"></div>' +
                        '<div class="tool line-tool"></div>' +
                        '<div class="tool title-tool"></div>' +
                        '<div class="tool title1-tool"></div>' +
                        '<div class="tool title2-tool"></div>' +
                        '<div class="tool last-step-tool"></div>' +
                        '<div class="tool next-step-tool"></div>' +
                    '</div>' +
                '</div>';
            var selector = obj.selector;
            $(selector).append(html);
        };
         
        obj.viewer = function() {
            var html = '<div class="markdown-viewer">' +
                    '<div class="markdown-viewer-inner"></div>' +
                '</div>';
            var selector = obj.selector + ' .markdown-wrapper';
            $(selector).append(html);
            var textarea_height = $(obj.selector + ' .markdown-wrapper').height()
                - $(obj.selector + ' .markdown-toolbar').height();
            $(obj.selector + ' .markdown-viewer').css('height', textarea_height);
        };

        obj.getSelectText = function(ctrl) {
            if (document.selection) { 
                return document.selection.createRange().text; 
            }  
            else {  
                return ctrl.value.substring(ctrl.selectionStart,  
                                        ctrl.selectionEnd);  
            }  
        };

        obj.setCaretPosition = function(ctrl, pos, end){
            if(ctrl.setSelectionRange) {
                ctrl.focus();
                ctrl.setSelectionRange(pos,end);
            }
            else if (ctrl.createTextRange) {
                var range = ctrl.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', end);
                range.select();
            }
        };

        obj.insertWords = function(text, pos, left_word, right_word, star) {
            return text.substr(0, pos) + left_word + star + right_word + text.substr(pos, text.length);
        };
        
        obj.getHrefPosition = function(text) {
            var re = new RegExp(/\[\d+\]: *\w+/,"g");
            var pos = text.search(re);
            if (pos == -1) {
                pos = text.length - 1;
            }
            else {
                var cnt = pos;
                while(cnt --) {
                    if (text[cnt] == '\n' || text[cnt] == '\t' || text[cnt] == ' ') {
                        continue;
                    }
                    else {
                        cnt ++;
                        break;
                    }
                }
                pos = cnt;
            }
            return pos;
        };

        obj.insertHref = function(text, input_text) {
            var cnt = obj.find_hrefs(text);
            var text_length = text.length;
            if (cnt == 1) {
                text += '\n\n';
            }
            text += '  [' + cnt + ']: ' + input_text + '\n';
            return text;
        };

        obj.find_hrefs = function(text) {
            var cnt = 1;
            var re = new RegExp(/\[\d+\]: *\w+/, "g");
            var hrefs = text.match(re);
            if (null != hrefs) {
                var hrefs_length = hrefs.length;
                cnt = hrefs_length + 1;
            }
            return cnt;
        };

        obj.history_push_back = function(o) {
            if(action_queue_last.length >= QUEUE_LENGTH) {
                action_queue_last.shift();
            }
            action_queue_last.push(o);
        };

        obj.history_get_last = function() {
            if(action_queue_last.length) {
                return action_queue_last.pop();
            }
            else {
                return -1;
            }
        };

        obj.history_push_next = function(o) {
            if(action_queue_next.length >= QUEUE_LENGTH) {
                action_queue_next.shift();
            }
            action_queue_next.push(o);
        };

        obj.history_get_next = function() {
            if(action_queue_next.length) {
                return action_queue_next.shift();
            }
            else {
                return -1;
            }
        };

        obj.convert_down = function() {
            var textarea = obj.selector + ' textarea';
            var viewer = obj.selector + ' .markdown-viewer .markdown-viewer-inner';
            var _textarea = $(textarea);
            var _viewer = $(viewer);
            var text = _textarea.val();
            if(localStorage['_markdown_text'] != text || first_open == 0) {
                first_open = 1;
                localStorage['_markdown_text'] = text;
                obj.history_push_back(text);
            }
            _viewer.html(converter.makeHtml(text));
        };

        obj.last_step = function() {
            var textarea = obj.selector + ' textarea';
            var viewer = obj.selector + ' .markdown-viewer .markdown-viewer-inner';
            var _textarea = $(textarea);
            var _viewer = $(viewer);
            var text = obj.history_get_last();
            if (text != -1) {
                obj.history_push_next(text);
                _textarea.val(text);
                _viewer.html(converter.makeHtml(text));
                localStorage['_markdown_text'] = text;
            }
        };

        obj.next_step = function() {
            var textarea = obj.selector + ' textarea';
            var viewer = obj.selector + ' .markdown-viewer .markdown-viewer-inner';
            var _textarea = $(textarea);
            var _viewer = $(viewer);
            var text = obj.history_get_next();
            if (text != -1) {
                obj.history_push_back(text);
                _textarea.val(text);
                _viewer.html(converter.makeHtml(text));
                localStorage['_markdown_text'] = text;
            }
        };

        obj.addEventListener = function(action) {
            var _textarea = $(obj.selector + ' textarea');
            if (action === 'blod') {
                $('.blod').on('click', function() {
                    var pos = _textarea.caret('pos');
                    var text = _textarea.val();
                    var final_text = obj.insertWords(text, pos, '**', '**', BLOD);
                    _textarea.val(final_text);
                    obj.setCaretPosition($(obj.selector + ' textarea')[0], pos + 2, pos + BLOD.length + 2);
                    obj.convert_down();
                });
            }
            else if(action === 'italic') {
                $('.italic').on('click', function(){
                    var pos = _textarea.caret('pos');
                    var text = _textarea.val();
                    var final_text = obj.insertWords(text, pos, '*', '*', ITALIC);
                    _textarea.val(final_text);
                    obj.setCaretPosition($(obj.selector + ' textarea')[0], pos + 1, pos + BLOD.length + 1);
                    obj.convert_down();
                });
            }
            else if(action === 'a') {
                $('.a').on('click', function(){
                    _a_menu = new obj.menu(
                        '添加链接', 
                        '<input class="add-href" type="text"/>', 
                        function(){
                            //confirm event
                            var pos = _textarea.caret('pos');
                            var text = _textarea.val();
                            var final_text = obj.insertWords(text, pos, '[', '][' + obj.find_hrefs(text) + ']\n', A);
                            _textarea.val(final_text);
                            var selector = obj.selector + ' .add-href';
                            var _selector = $(selector);
                            text = _textarea.val();
                            var input_text = _selector.val();
                            if (input_text.length) {
                                var final_text = obj.insertHref(text, input_text);
                                _textarea.val(final_text);
                                obj.setCaretPosition($(obj.selector + ' textarea')[0], pos + 1, pos + 1 + A.length);
                            }
                            obj.convert_down();
                        }
                    );
                    _a_menu.show_or_hidden();

                });
            }
            else if(action === 'quote') {
                $('.quote').on('click', function(){
                    var pos = _textarea.caret('pos');
                    var text = _textarea.val();
                    var insert_left_word = '';
                    if(pos) {
                        insert_left_word += '\n';
                    }
                    insert_left_word += '> ';
                    var final_text = obj.insertWords(text, pos ,insert_left_word ,'' , quote);
                    _textarea.val(final_text);
                    obj.setCaretPosition($(obj.selector + ' textarea')[0], pos + insert_left_word.length, pos + insert_left_word.length + quote.length);
                    obj.convert_down();
                });
            }
            else if(action === 'code') {
                $('.code').on('click', function(){
                    var pos = _textarea.caret('pos');
                    var text = _textarea.val();
                    var insert_left_word = '';
                    if(pos) {
                        insert_left_word += '\n';
                    }
                    insert_left_word += '\t';
                    var final_text = obj.insertWords(text, pos ,insert_left_word ,'' , CODE);
                    _textarea.val(final_text);
                    obj.setCaretPosition($(obj.selector + ' textarea')[0], pos + insert_left_word.length, pos + insert_left_word.length + quote.length);
                    obj.convert_down();
                });
            }
            else if(action === 'title') {
                $('.title-tool').on('click', function(){
                    var pos = _textarea.caret('pos');
                    var text = _textarea.val();
                    console.log(text);
                    var final_text = obj.insertWords(text, pos, '\n### ', ' ###', TITLE);
                    _textarea.val(final_text);
                    obj.setCaretPosition($(obj.selector + ' textarea')[0], pos + 4, pos + TITLE.length + 4);
                    obj.convert_down();
                });
            }
            else if(action === 'title1') {
                $('.title1-tool').on('click', function(){
                    var pos = _textarea.caret('pos');
                    var text = _textarea.val();
                    console.log(text);
                    var final_text = obj.insertWords(text, pos, '\n', '\n---\n', TITLE);
                    _textarea.val(final_text);
                    obj.setCaretPosition($(obj.selector + ' textarea')[0], pos + 1 , pos + TITLE.length + 1);
                    obj.convert_down();
                });
            }
            else if(action === 'title2') {
                $('.title2-tool').on('click', function(){
                    var pos = _textarea.caret('pos');
                    var text = _textarea.val();
                    var final_text = obj.insertWords(text, pos, '\n', '\n===\n', TITLE);
                    _textarea.val(final_text);
                    obj.setCaretPosition($(obj.selector + ' textarea')[0], pos + 1, pos + TITLE.length + 1);
                    obj.convert_down();
                });
            }
            else if(action === 'line') {
                $('.line-tool').on('click', function(){
                    var pos = _textarea.caret('pos');
                    var text = _textarea.val();
                    var final_text = obj.insertWords(text, pos, '\n', '----\n', '');
                    _textarea.val(final_text);
                    obj.setCaretPosition($(obj.selector + ' textarea')[0], pos + 6, pos + 6);
                    obj.convert_down();
                });
            }
            else if(action === 'image') {
                $('.image-tool').on('click', function(){
                    _image_menu = new obj.menu(
                        '添加图片链接', 
                        '<input class="add-image" type="text"/>', 
                        function(){
                            //confirm event
                            var pos = _textarea.caret('pos');
                            var text = _textarea.val();
                            var selector = obj.selector + ' .add-image';
                            var _selector = $(selector);
                            text = _textarea.val();
                            var input_text = _selector.val();
                            if (input_text.length) {
                                var final_text = obj.insertWords(text, pos, '![', '](' + input_text + ')\n', IMAGE);
                                _textarea.val(final_text);
                                obj.setCaretPosition($(obj.selector + ' textarea')[0], pos + 2, pos + 2 + IMAGE.length);
                            }
                        }
                    );
                    _image_menu.show_or_hidden();
                    obj.convert_down();
                });
            }
            else if(action === 'last') {
                $('.last-step-tool').on('click', function(){
                    obj.last_step();
                });
            }
            else if(action === 'next') {
                $('.next-step-tool').on('click', function(){
                    obj.next_step();
                });
            }
        };
        
        obj.delete_letter = function(text, pos, letter) {
            if (letter == text[pos]) {
                return text.substring(0, pos) + text.substring(pos + 1, text.length);
            }
            else {
                return text;
            }
        };

        obj.editor = function() {
            var html = '<div class="markdown-editor">' +
                '<div class="editor">' + 
                '<textarea/>' +
                '</div>' +
            '</div>';
            
            var selector = obj.selector + ' .markdown-wrapper';
            
            $(selector).append(html);
            
            var textarea_height = $(obj.selector + ' .markdown-wrapper').height()
                - $(obj.selector + ' .markdown-toolbar').height();
            
            $(obj.selector + ' textarea').css('height', textarea_height);


            for (var i in obj.events) {
                obj.addEventListener(obj.events[i]);
            }

            var _textarea = $(obj.selector + ' textarea');
            _textarea.on('keyup', function(){
                obj.convert_down();
            });
            _textarea.on('keydown', function(event){

                var pos = _textarea.caret('pos');
                var text = _textarea.val();
                if (event.keyCode == 9 && event.shiftKey) {
                    event.preventDefault();
                    var selected_text = obj.getSelectText($(obj.selector + ' textarea')[0]);
                    if(selected_text.length) {
                        var selected_text = obj.getSelectText($(obj.selector + ' textarea')[0]);
                        var cnt = 0;
                        for(var i=0; i<selected_text.length; i++) {
                            if(selected_text[i] == '\n' || i == selected_text.length - 1) {
                                var line_head = i;
                                while(1) {
                                    -- line_head;
                                    console.log(text[pos + line_head - cnt]);
                                    if(text[pos + line_head - cnt] == '\t' || text[pos + line_head - cnt] == ' ') {
                                        console.log('need : '+ line_head);
                                        text = obj.delete_letter(text, pos + line_head - cnt, text[pos + line_head - cnt]);
                                        ++ cnt;
                                        break;
                                    }
                                    if(line_head - cnt < 0 && pos > 0) {
                                        break;
                                    }
                                }
                                _textarea.val(text);
                            }
                        } 
                    }
                    else {
                        var cnt = pos;
                        var end_flag = false;
                        while(cnt--) {
                            if(text[cnt] == '\t') {
                                text = obj.delete_letter(text, cnt, '\t');
                                break;
                            }
                            if(text[cnt] == ' ') {
                                text = obj.delete_letter(text, cnt, ' ');
                                break;
                            }
                            if(text[cnt] == '\n') {
                                end_flag = true;
                                break;
                            }
                        }
                        _textarea.val(text);
                        var f_pos = end_flag ? pos : pos - 1;
                        obj.setCaretPosition($(obj.selector + ' textarea')[0], f_pos, f_pos);
                    }
                }
                else if (event.keyCode == 9) {
                    //tab active
                    event.preventDefault();
                    var selected_text = obj.getSelectText($(obj.selector + ' textarea')[0]);
                    if(selected_text.length) {
                        var final_text = obj.insertWords(text, pos , '\t', '', '');
                        _textarea.val(final_text);
                        text = final_text;
                        var cnt = 0;
                        for(var i=0; i<selected_text.length; i++) {
                            if(selected_text[i] == '\n') {
                                var final_text = obj.insertWords(text, pos + i + cnt + 2, '\t', '', '');
                                ++ cnt;
                                text = final_text;
                                console.log(text.length);
                            }
                        }
                        _textarea.val(text);
                        obj.convert_down();
                    }
                    else {
                        var final_text = obj.insertWords(text, pos, '\t', '', '');
                        _textarea.val(final_text);
                        obj.setCaretPosition($(obj.selector + ' textarea')[0], pos + 1, pos + 1);
                        obj.convert_down();
                    }
                }
                else if(event.keyCode == 13) {
                    event.preventDefault();
                    var cnt = pos;
                    //extend last line style (tab/space)
                    var str_head = '';
                    var final_text = obj.insertWords(text, pos, '\n', '', '');
                    _textarea.val(final_text);
                    text = final_text;
                    while(cnt --) {
                        if((text[cnt] == '\n') || cnt == 0) {
                            var line_head = 0;
                            if(cnt != 0 && text[cnt] == '\n') {
                                line_head = cnt + 1;
                            }
                            while(1) {
                                if(text[line_head] == ' ' || text[line_head] == '\t') {
                                    str_head += text[line_head];
                                }
                                else {
                                    break;
                                }
                                ++ line_head;
                            }
                            break;
                        }
                    }
                     
                    var final_text = obj.insertWords(text, pos+1, str_head, '', '');
                    _textarea.val(final_text);
                    obj.setCaretPosition($(obj.selector + ' textarea')[0], pos + 1 + str_head.length, pos + 1 + str_head.length);
                    obj.convert_down();
                }
                
            });
        };
        
        obj.menu = function(menu_title, menu_desc, success, fail, func) {
            var _menu = new Object();
            _menu.menu_body = '<div class="markdown-menu-background">'+
                    '<div class="markdown-menu">' + 
                        '<div class="markdown-menu-head">' + menu_title + '</div>' +
                        '<div class="markdown-menu-body">' + menu_desc + '</div>' +
                        '<div class="markdown-menu-footer">' + 
                            '<button class="markdown-menu-button cancle">' + CANCLE + '</button>' +
                            '<button class="markdown-menu-button confirm">' + CONFIRM +'</button>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            _menu.show_or_hidden = function() {
                var menu_selector = obj.selector + ' .markdown-menu-background';
                var _menu_selector = $(menu_selector);
                if (_menu_selector.hasClass('open')) {
                    //Remove document 
                    _menu_selector.removeClass('open');
                    $(menu_selector).remove();
                    _menu = null;
                } 
                else {
                    _menu_selector.addClass('open');
                }
            };
            _menu.addEventListener = function() {
                var cancle_selector = obj.selector + ' .markdown-menu-button.cancle';
                var confirm_selector = obj.selector + ' .markdown-menu-button.confirm';
                var _cancle_selector = $(cancle_selector);
                var _confirm_selector = $(confirm_selector);
                _cancle_selector.on('click', function(){
                    if (fail) fail();
                    _menu.show_or_hidden();
                });
                _confirm_selector.on('click', function(){
                    if (success) success();
                    _menu.show_or_hidden();
                });
            };
            if (undefined != func) {
                func();
            };
            $(obj.selector).append(_menu.menu_body);
            _menu.addEventListener();
            return _menu;
        };

        obj.getSaveText = function() {
            if (null != localStorage.getItem('_markdown_text')) {
                $(obj.selector + ' textarea').val(localStorage.getItem('_markdown_text'));
                obj.convert_down();
            }
        };

        obj.init = function() {
            window.onload = function() {
                obj.wrapper();
                obj.editor();
                obj.viewer();
                obj.getSaveText();
                obj.setTools();
            }
        };
        
        obj.getMarkDownText = function() {
            return localStorage['_markdown_text'];
        };

        return obj;
    };
    
    window.MarkdownEditor = MarkdownEditor;

})();
