var parse5 = require('parse5');
var parse5Utils = require('parse5-utils');
var startNodes, endNodes;

String.prototype.splice = function(start, newSubStr) {
  return this.slice(0, start) + newSubStr + this.slice(start);
};

var wrapBoth = (node, operation) => {
  var range = parse5Utils.getAttribute(node, "data-range");
  range = range.split("-");
  var start = parseInt(range[0]);
  var end = parseInt(range[1]);
  var text = node.childNodes[0].value;
  var parsedStart = operation.start - start;
  var parsedEnd = operation.end - start;

  if (node.nodeName === 'quvl-tag' && start === operation.start && end === operation.end) {
    const oldId = parse5Utils.getAttribute(node, 'data-id');
    parse5Utils.setAttribute(node, 'data-id', `* ${oldId}`);
  }
  else {
    parse5Utils.removeAttribute(node, "data-range");
    //put a tag for any trailing chars not in the comment
    if (end > operation.end) {
      var preTag = `<span data-range="${operation.end + 1}-${end}">`;
      var postTag = `</span>`;
      text = text.splice(end + 1, postTag);
      text = text.splice(parsedEnd + 1, preTag);
    }

    //make the comment
    var openTag = `<quvl-tag data-id='*' data-range="${operation.start}-${operation.end}">`;
    var closeTag = "</quvl-tag>";
    text = text.splice(parsedEnd + 1, closeTag)
    text = text.splice(parsedStart, openTag);

    //add the opening chars
    if (start < operation.start) {
      var preTag = `<span data-range="${start}-${operation.start-1}">`;
      var postTag = `</span>`;
      text = text.splice(parsedStart, postTag);
      text = text.splice(0, preTag);
    }

    var parsed = parse5.parseFragment(text);
    parse5Utils.remove(node.childNodes[0]);
    parsed.childNodes.forEach(childNode => {
      parse5Utils.append(node, childNode);
    });
  }
}

//put a span, followed by quvl tag
var wrapStart = (node, operation) => {
  var range = parse5Utils.getAttribute(node, "data-range");
  parse5Utils.removeAttribute(node, "data-range");
  range = range.split("-");
  var start = parseInt(range[0]);
  var end = parseInt(range[1]);
  var text = node.childNodes[0].value;
  var parsedStart = operation.start - start;

  var openTag = `<quvl-tag data-id='*' data-range="${operation.start}-${end}">`;
  var closeTag = "</quvl-tag>";

  text = text.splice(end + 1, closeTag)
  text = text.splice(parsedStart, openTag);

  var preTag = `<span data-range="${start}-${operation.start - 1}">`;
  var postTag = `</span>`;
  text = text.splice(parsedStart, postTag);
  text = text.splice(0, preTag);

  var parsed = parse5.parseFragment(text);
  parse5Utils.remove(node.childNodes[0]);
  parsed.childNodes.forEach(childNode => {
    parse5Utils.append(node, childNode);
  });
}

//put a quvl-tag, followed by span
var wrapEnd = (node, operation) => {
  var range = parse5Utils.getAttribute(node, "data-range");
  parse5Utils.removeAttribute(node, "data-range");
  range = range.split("-");
  var start = parseInt(range[0]);
  var end = parseInt(range[1]);
  var text = node.childNodes[0].value;
  var parsedEnd = operation.end - start;

  var preTag = `<span data-range="${operation.end + 1}-${end}">`;
  var postTag = `</span>`;
  text = text.splice(end, postTag);
  text = text.splice(parsedEnd + 1, preTag);

  var openTag = `<quvl-tag data-id='*' data-range="${start}-${operation.end}">`;
  var closeTag = "</quvl-tag>";

  text = text.splice(parsedEnd + 1, closeTag)
  text = text.splice(0, openTag);

  var parsed = parse5.parseFragment(text);
  parse5Utils.remove(node.childNodes[0]);
  parsed.childNodes.forEach(childNode => {
    parse5Utils.append(node, childNode);
  });
}

var walkTheDOM = (node, func) => {
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

var populateNodes = (node) => {
  var range = parse5Utils.getAttribute(node, "data-range");
  if (range) {
    range = range.split("-");
    var start = parseInt(range[0]);
    var end = parseInt(range[1]);
    startNodes[start] = node;
    endNodes[end] = node;
  }
}

var closestStartWithoutGoingOver = (index, nodes) => {
  var arr = Object.keys(nodes);
  arr = arr.map(n => parseInt(n));
  arr = arr.sort((a, b) => a - b);
  var i = 0;
  var bestNode = nodes[arr[0]];
  while (parseInt(arr[i]) <= index) {
    bestNode = nodes[arr[i]];
    i++;
  }
  return bestNode;
}

var closestEndWithoutGoingOver = (index, nodes) => {
  var arr = Object.keys(nodes);
  arr = arr.map(n => parseInt(n)).sort((a, b) => b - a);
  var i = 0;
  var bestNode = nodes[arr[0]];
  while (parseInt(arr[i]) >= index) {
    bestNode = nodes[arr[i]];
    i++;
  }
  return bestNode;
}

const wrapTags = (requested, ops) => {
  const doc = requested.replace(/\\"/g, '"');
  const myHtmlDoc = parse5.parseFragment(doc);

  ops.forEach(operation => {

    startNodes = {};
    endNodes = {};

    walkTheDOM(myHtmlDoc, populateNodes);

    const startNodeToWrap = closestStartWithoutGoingOver(operation.start, startNodes);
    const endNodeToWrap = closestEndWithoutGoingOver(operation.end, endNodes);

    if (startNodeToWrap === endNodeToWrap) {
      wrapBoth(startNodeToWrap, operation);
    }
    else {
      wrapStart(startNodeToWrap, operation);
      wrapEnd(endNodeToWrap, operation);
    }
  });
  const results = parse5.serialize(myHtmlDoc);
  return results;
}

export default wrapTags;
