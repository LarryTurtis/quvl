 window.addEventListener("load", () => {
   (() => {
     tinymce.init({
       selector: '#tinymce'
     });

     var text;
     var previousBody;
     var current;
     var newSentence;
     var timer;
     var addingComment = false;
     var filterComments = false;
     var wrappedNodes = [];

     $(document).mouseup(() => {
       text = window.getSelection();
       $('.highlight').removeClass('highlight');
       if (text.isCollapsed) {
         $('#addCommentButton').hide();
         addingComment = false;
       } else {
         addingComment = true;
         $('#addCommentButton').show();
         //offSentence();
       }
     });

     if (filterComments) {
       jQuery('quvl-tag[data-author-id!=' + jQuery('#userId').val() + ']').removeClass('quvl');
     }


     $("quvl-tag").click(function() {
       newSentence = jQuery(this).data('comment-id');
       jQuery('quvl-tag[data-comment-id=' + newSentence + ']').addClass('highlight');
       jQuery('.comment[data-comment-id=' + newSentence + ']').addClass('highlight');
     });

     $("#addCommentButton").click(() => {
       wrappedNodes = [];
       $("#addCommentButton").hide();
       $('.addComment').show();
       addComment();
     });

     $("#saveCommentButton").click(() => {
       $(".select").removeClass("select");

       var pageURL = $(location).attr("href");
       let data = $('form').serialize() + 
       "&nodes=" + JSON.stringify(wrappedNodes);

       $.post(pageURL, data, response => {
         location.reload();
       });

     });

     $("#cancelCommentButton").click(() => {
       cancelComment();
     });

     jQuery('#content').css('visibility', 'visible');

     function cancelComment() {
       addingComment = false;
       $('#content').html(previousBody);
       $('.addComment').hide();
       //$("span.quvl").hover(onSentence, offSentence);
     }

     function addComment() {
       previousBody = $('#content').html();

       if (text.anchorNode === text.focusNode) {
         var start = Math.min(text.anchorOffset, text.focusOffset);
         var end = Math.max(text.anchorOffset, text.focusOffset);

         let parent = text.anchorNode.parentNode;
         let beforeText = text.anchorNode.textContent.substring(0, start);
         let selected = text.anchorNode.textContent.substr(start, end - start);
         let afterText = text.anchorNode.textContent.substring(end, text.anchorNode.textContent.length);

         let beforeNode = document.createTextNode(beforeText);
         let selectedNode = document.createTextNode(selected);
         let afterNode = document.createTextNode(afterText);

         let wrapper = document.createElement('span');
         wrapper.className = " select";
         wrapper.appendChild(selectedNode);
         parent.insertBefore(afterNode, text.anchorNode)
         parent.insertBefore(wrapper, afterNode);
         parent.insertBefore(beforeNode, wrapper);
         parent.removeChild(text.anchorNode);

         var localRange = parent.getAttribute('data-range').split("-");
         if (localRange) wrappedNodes.push({start: parseInt(localRange[0]) + start, end: parseInt(localRange[0]) + end - 1})

       } else {

         var range = text.getRangeAt(0);
         var startNodeFound = false;
         var endNodeFound = false;

         text.removeAllRanges();

         var nodesToWrap = [];
         walkTheDOM(range.commonAncestorContainer, range.endContainer, saveNode);

         nodesToWrap.forEach(wrapNode);

         function saveNode(node) {
           startNodeFound = startNodeFound || range.startContainer === node;
           endNodeFound = endNodeFound || range.endContainer === node;
           if (startNodeFound) nodesToWrap.push(node);
         }

         function wrapNode(node) {
           if (node === range.startContainer && node.nodeName === "#text" && !hasClass(node, 'select')) {
             let parent = node.parentNode;
             var localRange = parent.getAttribute('data-range').split("-");
             if (localRange) wrappedNodes.push({start: parseInt(localRange[0]) + range.startOffset, end: parseInt(localRange[1])})

             let beforeText = node.textContent.substring(0, range.startOffset);
             let selected = node.textContent.substring(range.startOffset);

             let beforeNode = document.createTextNode(beforeText);
             let selectedNode = document.createTextNode(selected);

             let wrapper = document.createElement('span');
             wrapper.className += ' select';
             wrapper.appendChild(selectedNode);
             parent.insertBefore(wrapper, node);
             parent.insertBefore(beforeNode, wrapper);
             parent.removeChild(node);
           } else if (node === range.endContainer && node.nodeName === "#text" && !hasClass(node, 'select')) {

             let parent = node.parentNode;
             var localRange = parent.getAttribute('data-range').split("-");
             if (localRange) wrappedNodes.push({start: parseInt(localRange[0]), end: parseInt(localRange[0]) + range.endOffset - 1})

             let selected = node.textContent.substring(0, range.endOffset);
             let afterText = node.textContent.substring(range.endOffset);

             let afterNode = document.createTextNode(afterText);
             let selectedNode = document.createTextNode(selected);

             let wrapper = document.createElement('span');
             wrapper.className += ' select';
             wrapper.appendChild(selectedNode);
             parent.insertBefore(afterNode, node);
             parent.insertBefore(wrapper, afterNode);
             parent.removeChild(node);
           } else if (node.nodeName === "#text" && !hasClass(node, 'select')) {
             let parent = node.parentNode;
             var localRange = parent.getAttribute('data-range').split("-");
             if (localRange) wrappedNodes.push({start: parseInt(localRange[0]), end: parseInt(localRange[1])})
             let wrapper = document.createElement('span');
             wrapper.className += ' select';
             parent.insertBefore(wrapper, node);
             wrapper.appendChild(node);
           }
         }
       }

       $('#commentBox').focus().val("");

       function hasClass(element, cls) {
         return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
       }

       function walkTheDOM(node, end, func) {
         func(node);
         node = node.firstChild;
         while (node && !endNodeFound) {
           walkTheDOM(node, end, func);
           node = node.nextSibling;
         }
       }
     }

     // $("span.quvl").hover(onSentence, offSentence);

     // function onSentence() {
     //     if (!addingComment) {
     //         clearTimeout(timer);
     //         timer = null;
     //         current = current !== undefined ? current : jQuery(this).data('comment-id');
     //         newSentence = jQuery(this).data('comment-id');
     //         jQuery('span.quvl[data-comment-id=' + newSentence + ']').addClass('highlight');
     //         jQuery('.comment[data-comment-id=' + newSentence + ']').addClass('highlight');
     //         if (newSentence !== current) nextSentence();
     //     }
     // }

     // function nextSentence() {
     //     jQuery('span.quvl[data-comment-id=' + current + ']').removeClass('highlight');
     //     jQuery('.comment[data-comment-id=' + current + ']').removeClass('highlight');
     //     current = newSentence;
     // }

     // function offSentence() {
     //     if (!timer) timer = setTimeout(() => {
     //        jQuery('span.quvl[data-comment-id=' + current + ']').removeClass('highlight');
     //        jQuery('.comment[data-comment-id=' + current + ']').removeClass('highlight');
     //    }, 200);
     // }

   })();
 });