!function e(t,o,n){function r(i,l){if(!o[i]){if(!t[i]){var s="function"==typeof require&&require;if(!l&&s)return s(i,!0);if(a)return a(i,!0);throw new Error("Cannot find module '"+i+"'")}var c=o[i]={exports:{}};t[i][0].call(c.exports,function(e){var o=t[i][1][e];return r(o?o:e)},c,c.exports,e,t,o,n)}return o[i].exports}for(var a="function"==typeof require&&require,i=0;i<n.length;i++)r(n[i]);return r}({1:[function(){!function(){"use strict";var e="粗体",t="斜体",o="链接地址",n="段落引用",r="代码",a="标题",i="图片描述",l="取消",s="确定",c=200,d=0,v=new showdown.Converter,u=[],f=[],h=function(h){var w=new Object,g=null,m=null;return w.selector="selector"in h?h.selector:"body",w.width="width"in h?h.width:"100%",w.height="height"in h?h.height:"100%",w.events=["blod","italic","a","quote","code","title","title1","title2","line","image","last","next"],w.wrapper=function(){var e='<div class="markdown-wrapper" style="width:'+w.width+";height:"+w.height+';"><div class="markdown-toolbar"><div class="tool image-tool"></div><div class="tool quote"></div><div class="tool a"></div><div class="tool blod"></div><div class="tool italic"></div><div class="tool code"></div><div class="tool line-tool"></div><div class="tool title-tool"></div><div class="tool title1-tool"></div><div class="tool title2-tool"></div><div class="tool last-step-tool"></div><div class="tool next-step-tool"></div></div></div>',t=w.selector;$(t).append(e)},w.viewer=function(){var e='<div class="markdown-viewer"><div class="markdown-viewer-inner"></div></div>',t=w.selector+" .markdown-wrapper";$(t).append(e);var o=$(w.selector+" .markdown-wrapper").height()-$(w.selector+" .markdown-toolbar").height();$(w.selector+" .markdown-viewer").css("height",o)},w.getSelectText=function(e){return document.selection?document.selection.createRange().text:e.value.substring(e.selectionStart,e.selectionEnd)},w.setCaretPosition=function(e,t,o){if(e.setSelectionRange)e.focus(),e.setSelectionRange(t,o);else if(e.createTextRange){var n=e.createTextRange();n.collapse(!0),n.moveEnd("character",o),n.moveStart("character",o),n.select()}},w.insertWords=function(e,t,o,n,r){return e.substr(0,t)+o+r+n+e.substr(t,e.length)},w.getHrefPosition=function(e){var t=new RegExp(/\[\d+\]: *\w+/,"g"),o=e.search(t);if(-1==o)o=e.length-1;else{for(var n=o;n--;)if("\n"!=e[n]&&"	"!=e[n]&&" "!=e[n]){n++;break}o=n}return o},w.insertHref=function(e,t){{var o=w.find_hrefs(e);e.length}return 1==o&&(e+="\n\n"),e+="  ["+o+"]: "+t+"\n"},w.find_hrefs=function(e){var t=1,o=new RegExp(/\[\d+\]: *\w+/,"g"),n=e.match(o);if(null!=n){var r=n.length;t=r+1}return t},w.history_push_back=function(e){u.length>=c&&u.shift(),u.push(e)},w.history_get_last=function(){return u.length?u.pop():-1},w.history_push_next=function(e){f.length>=c&&f.shift(),f.push(e)},w.history_get_next=function(){return f.length?f.shift():-1},w.convert_down=function(){var e=w.selector+" textarea",t=w.selector+" .markdown-viewer .markdown-viewer-inner",o=$(e),n=$(t),r=o.val();(localStorage._markdown_text!=r||0==d)&&(d=1,localStorage._markdown_text=r,w.history_push_back(r)),n.html(v.makeHtml(r))},w.last_step=function(){var e=w.selector+" textarea",t=w.selector+" .markdown-viewer .markdown-viewer-inner",o=$(e),n=$(t),r=w.history_get_last();-1!=r&&(w.history_push_next(r),o.val(r),n.html(v.makeHtml(r)),localStorage._markdown_text=r)},w.next_step=function(){var e=w.selector+" textarea",t=w.selector+" .markdown-viewer .markdown-viewer-inner",o=$(e),n=$(t),r=w.history_get_next();-1!=r&&(w.history_push_back(r),o.val(r),n.html(v.makeHtml(r)),localStorage._markdown_text=r)},w.addEventListener=function(l){var s=$(w.selector+" textarea");"blod"===l?$(".blod").on("click",function(){var t=s.caret("pos"),o=s.val(),n=w.insertWords(o,t,"**","**",e);s.val(n),w.setCaretPosition($(w.selector+" textarea")[0],t+2,t+e.length+2),w.convert_down()}):"italic"===l?$(".italic").on("click",function(){var o=s.caret("pos"),n=s.val(),r=w.insertWords(n,o,"*","*",t);s.val(r),w.setCaretPosition($(w.selector+" textarea")[0],o+1,o+e.length+1),w.convert_down()}):"a"===l?$(".a").on("click",function(){g=new w.menu("添加链接",'<input class="add-href" type="text"/>',function(){var e=s.caret("pos"),t=s.val(),n=w.insertWords(t,e,"[","]["+w.find_hrefs(t)+"]\n",o);s.val(n);var r=w.selector+" .add-href",a=$(r);t=s.val();var i=a.val();if(i.length){var n=w.insertHref(t,i);s.val(n),w.setCaretPosition($(w.selector+" textarea")[0],e+1,e+1+o.length)}w.convert_down()}),g.show_or_hidden()}):"quote"===l?$(".quote").on("click",function(){var e=s.caret("pos"),t=s.val(),o="";e&&(o+="\n"),o+="> ";var r=w.insertWords(t,e,o,"",n);s.val(r),w.setCaretPosition($(w.selector+" textarea")[0],e+o.length,e+o.length+n.length),w.convert_down()}):"code"===l?$(".code").on("click",function(){var e=s.caret("pos"),t=s.val(),o="";e&&(o+="\n"),o+="	";var a=w.insertWords(t,e,o,"",r);s.val(a),w.setCaretPosition($(w.selector+" textarea")[0],e+o.length,e+o.length+n.length),w.convert_down()}):"title"===l?$(".title-tool").on("click",function(){var e=s.caret("pos"),t=s.val();console.log(t);var o=w.insertWords(t,e,"\n### "," ###",a);s.val(o),w.setCaretPosition($(w.selector+" textarea")[0],e+4,e+a.length+4),w.convert_down()}):"title1"===l?$(".title1-tool").on("click",function(){var e=s.caret("pos"),t=s.val();console.log(t);var o=w.insertWords(t,e,"\n","\n---\n",a);s.val(o),w.setCaretPosition($(w.selector+" textarea")[0],e+1,e+a.length+1),w.convert_down()}):"title2"===l?$(".title2-tool").on("click",function(){var e=s.caret("pos"),t=s.val(),o=w.insertWords(t,e,"\n","\n===\n",a);s.val(o),w.setCaretPosition($(w.selector+" textarea")[0],e+1,e+a.length+1),w.convert_down()}):"line"===l?$(".line-tool").on("click",function(){var e=s.caret("pos"),t=s.val(),o=w.insertWords(t,e,"\n","----\n","");s.val(o),w.setCaretPosition($(w.selector+" textarea")[0],e+6,e+6),w.convert_down()}):"image"===l?$(".image-tool").on("click",function(){m=new w.menu("添加图片链接",'<input class="add-image" type="text"/>',function(){var e=s.caret("pos"),t=s.val(),o=w.selector+" .add-image",n=$(o);t=s.val();var r=n.val();if(r.length){var a=w.insertWords(t,e,"![","]("+r+")\n",i);s.val(a),w.setCaretPosition($(w.selector+" textarea")[0],e+2,e+2+i.length)}}),m.show_or_hidden(),w.convert_down()}):"last"===l?$(".last-step-tool").on("click",function(){w.last_step()}):"next"===l&&$(".next-step-tool").on("click",function(){w.next_step()})},w.delete_letter=function(e,t,o){return o==e[t]?e.substring(0,t)+e.substring(t+1,e.length):e},w.editor=function(){var e='<div class="markdown-editor"><div class="editor"><textarea/></div></div>',t=w.selector+" .markdown-wrapper";$(t).append(e);var o=$(w.selector+" .markdown-wrapper").height()-$(w.selector+" .markdown-toolbar").height();$(w.selector+" textarea").css("height",o);for(var n in w.events)w.addEventListener(w.events[n]);var r=$(w.selector+" textarea");r.on("keyup",function(){w.convert_down()}),r.on("keydown",function(e){var t=r.caret("pos"),o=r.val();if(9==e.keyCode&&e.shiftKey){e.preventDefault();var n=w.getSelectText($(w.selector+" textarea")[0]);if(n.length){for(var n=w.getSelectText($(w.selector+" textarea")[0]),a=0,i=0;i<n.length;i++)if("\n"==n[i]||i==n.length-1){for(var l=i;;){if(--l,console.log(o[t+l-a]),"	"==o[t+l-a]||" "==o[t+l-a]){console.log("need : "+l),o=w.delete_letter(o,t+l-a,o[t+l-a]),++a;break}if(0>l-a&&t>0)break}r.val(o)}}else{for(var a=t,s=!1;a--;){if("	"==o[a]){o=w.delete_letter(o,a,"	");break}if(" "==o[a]){o=w.delete_letter(o,a," ");break}if("\n"==o[a]){s=!0;break}}r.val(o);var c=s?t:t-1;w.setCaretPosition($(w.selector+" textarea")[0],c,c)}}else if(9==e.keyCode){e.preventDefault();var n=w.getSelectText($(w.selector+" textarea")[0]);if(n.length){var d=w.insertWords(o,t,"	","","");r.val(d),o=d;for(var a=0,i=0;i<n.length;i++)if("\n"==n[i]){var d=w.insertWords(o,t+i+a+2,"	","","");++a,o=d,console.log(o.length)}r.val(o),w.convert_down()}else{var d=w.insertWords(o,t,"	","","");r.val(d),w.setCaretPosition($(w.selector+" textarea")[0],t+1,t+1),w.convert_down()}}else if(13==e.keyCode){e.preventDefault();var a=t,v="",d=w.insertWords(o,t,"\n","","");for(r.val(d),o=d;a--;)if("\n"==o[a]||0==a){var l=0;for(0!=a&&"\n"==o[a]&&(l=a+1);;){if(" "!=o[l]&&"	"!=o[l])break;v+=o[l],++l}break}var d=w.insertWords(o,t+1,v,"","");r.val(d),w.setCaretPosition($(w.selector+" textarea")[0],t+1+v.length,t+1+v.length),w.convert_down()}})},w.menu=function(e,t,o,n,r){var a=new Object;return a.menu_body='<div class="markdown-menu-background"><div class="markdown-menu"><div class="markdown-menu-head">'+e+'</div><div class="markdown-menu-body">'+t+'</div><div class="markdown-menu-footer"><button class="markdown-menu-button cancle">'+l+'</button><button class="markdown-menu-button confirm">'+s+"</button></div></div></div>",a.show_or_hidden=function(){var e=w.selector+" .markdown-menu-background",t=$(e);t.hasClass("open")?(t.removeClass("open"),$(e).remove(),a=null):t.addClass("open")},a.addEventListener=function(){var e=w.selector+" .markdown-menu-button.cancle",t=w.selector+" .markdown-menu-button.confirm",r=$(e),i=$(t);r.on("click",function(){n&&n(),a.show_or_hidden()}),i.on("click",function(){o&&o(),a.show_or_hidden()})},void 0!=r&&r(),$(w.selector).append(a.menu_body),a.addEventListener(),a},w.getSaveText=function(){null!=localStorage.getItem("_markdown_text")&&($(w.selector+" textarea").val(localStorage.getItem("_markdown_text")),w.convert_down())},w.init=function(){window.onload=function(){w.wrapper(),w.editor(),w.viewer(),w.getSaveText()}},w.getMarkDownText=function(){return localStorage._markdown_text},w};window.MarkdownEditor=h}()},{}]},{},[1]);