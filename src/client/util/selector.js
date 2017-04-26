let text;
let previousBody;
let wrappedNodes = [];
let range;
let center;

function hasClass(element, cls) {
  return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function wrapNode(node) {
  if (node === range.startContainer &&
    node.nodeName === '#text' &&
    !hasClass(node, 'select')) {
    const parent = node.parentNode;
    const localRange = parent.getAttribute('data-range').split('-');
    if (localRange) {
      wrappedNodes.push({
        start: parseInt(localRange[0], 10) + range.startOffset,
        end: parseInt(localRange[1], 10)
      });
    }

    const beforeText = node.textContent.substring(0, range.startOffset);
    const selected = node.textContent.substring(range.startOffset);

    const beforeNode = document.createTextNode(beforeText);
    const selectedNode = document.createTextNode(selected);

    const wrapper = document.createElement('span');
    wrapper.className += ' select';
    wrapper.appendChild(selectedNode);
    parent.insertBefore(wrapper, node);
    parent.insertBefore(beforeNode, wrapper);
    parent.removeChild(node);

    const rect = wrapper.getBoundingClientRect();
    center = {
      x: rect.left + ((rect.right - rect.left) / 2),
      y: rect.top + window.scrollY
    };
  }
  else if (node === range.endContainer
    && node.nodeName === '#text'
    && !hasClass(node, 'select')) {
    const parent = node.parentNode;
    const localRange = parent.getAttribute('data-range').split('-');
    if (localRange) {
      wrappedNodes.push({
        start: parseInt(localRange[0], 10),
        end: parseInt(localRange[0], 10) + (range.endOffset - 1)
      });
    }

    const selected = node.textContent.substring(0, range.endOffset);
    const afterText = node.textContent.substring(range.endOffset);

    const afterNode = document.createTextNode(afterText);
    const selectedNode = document.createTextNode(selected);

    const wrapper = document.createElement('span');
    wrapper.className += ' select';
    wrapper.appendChild(selectedNode);
    parent.insertBefore(afterNode, node);
    parent.insertBefore(wrapper, afterNode);
    parent.removeChild(node);
  }
  else if (node.nodeName === '#text' && !hasClass(node, 'select')) {
    const parent = node.parentNode;
    const localRange = parent.getAttribute('data-range').split('-');
    if (localRange) {
      wrappedNodes.push({
        start: parseInt(localRange[0], 10),
        end: parseInt(localRange[1], 10)
      });
    }
    const wrapper = document.createElement('span');
    wrapper.className += ' select';
    parent.insertBefore(wrapper, node);
    wrapper.appendChild(node);
  }
}

function addComment(element) {
  previousBody = element.innerHTML;

  if (text.anchorNode === text.focusNode) {
    const start = Math.min(text.anchorOffset, text.focusOffset);
    const end = Math.max(text.anchorOffset, text.focusOffset);

    const parent = text.anchorNode.parentNode;
    const content = text.anchorNode.textContent;
    const beforeText = content.substring(0, start);
    const selected = content.substr(start, end - start);
    const afterText = content.substring(end, content.length);

    const beforeNode = document.createTextNode(beforeText);
    const selectedNode = document.createTextNode(selected);
    const afterNode = document.createTextNode(afterText);

    const wrapper = document.createElement('span');
    wrapper.className = ' select';
    wrapper.appendChild(selectedNode);
    parent.insertBefore(afterNode, text.anchorNode);
    parent.insertBefore(wrapper, afterNode);
    parent.insertBefore(beforeNode, wrapper);
    parent.removeChild(text.anchorNode);

    const rect = wrapper.getBoundingClientRect();
    center = {
      x: rect.left + ((rect.right - rect.left) / 2),
      y: rect.top + window.scrollY
    };
    const localRange = parent.getAttribute('data-range').split('-');
    if (localRange) {
      wrappedNodes.push({
        start: parseInt(localRange[0], 10) + start,
        end: parseInt(localRange[0], 10) + (end - 1)
      });
    }
  }
  else {
    range = text.getRangeAt(0);
    var startNodeFound = false;
    var endNodeFound = false;
    text.removeAllRanges();

    const nodesToWrap = [];
    walkTheDOM(range.commonAncestorContainer, range.endContainer, node => {
      startNodeFound = startNodeFound || range.startContainer === node;
      endNodeFound = endNodeFound || range.endContainer === node;
      if (startNodeFound) {
        nodesToWrap.push(node);
      }
    });

    nodesToWrap.forEach(wrapNode);

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

function clearSelection() {
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  }
  else if (document.selection) {
    document.selection.empty();
  }
}

class Selector {
  constructor(element, selectCb, deselectCb) {
    this.element = element;
    this.deselectCb = deselectCb;
    this.selectCb = selectCb;
    this.listener = () => {
      wrappedNodes = [];
      range = null;
      text = window.getSelection();

      if (previousBody) {
        this.element.innerHTML = previousBody;
        previousBody = null;
      }
      deselectCb();
      center = null;
      if (!text.isCollapsed) {
        addComment(element);
        this.center = center;
        selectCb(wrappedNodes);
      }
    };
    this.element.addEventListener('mouseup', this.listener);
  }

  on = () => {
    previousBody = null;
    this.element.addEventListener('mouseup', this.listener);
  }
  off = () => {
    this.element.removeEventListener('mouseup', this.listener);
  }
  position = () => this.center;
  cancel = () => {
    clearSelection();
    if (previousBody) {
      this.element.innerHTML = previousBody;
      previousBody = null;
    }
    this.deselectCb();
    center = null;
  }

}

export default Selector;
