var parse5 = require('parse5');
var parse5Utils = require('parse5-utils');
var nodesToWrap = [];

module.exports = function(doc) {
  var myHtmlDoc = parse5.parseFragment(doc);
  
  walkTheDOM(myHtmlDoc, testWrap);
  nodesToWrap.forEach(doWrap);

  walkTheDOM(myHtmlDoc, setUpSentences);
  index = 0;
  return parse5.serialize(myHtmlDoc);
}

var index = 0;

function testWrap(node) {
  if (node.nodeName === "#text" && node.parentNode.childNodes.length > 1) {
    nodesToWrap.push(node);
  }
}

function doWrap(node) {
  var wrapper = parse5Utils.createNode('span');
  parse5Utils.replace(node, wrapper);
  parse5Utils.append(wrapper, node);

}

function setUpSentences(node) {
  if (node.nodeName === "#text") { // Is it a Text node?
    if (node.value.length > 0) { // Does it have non white-space text content?
      var parent = node.parentNode;
      var range = index + "-";
      index += node.value.length - 1;
      range += index
      parse5Utils.setAttribute(parent, "data-range", range);
      index += 1;
    }
  }
}

function walkTheDOM(node, func) {
  func(node);
  var nodeIndex = 0;
  node = node.childNodes && node.childNodes[nodeIndex];
  while (node) {
    walkTheDOM(node, func);
    nodeIndex++;
    node = node.parentNode && node.parentNode.childNodes && node.parentNode.childNodes[nodeIndex];
  }
  nodeIndex = 0;
}