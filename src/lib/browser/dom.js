var css = require('lib/ui/css'),
  functional = require('lib/functional'),
  array = require('lib/array');

exports.onDocumentReady = function(callback) {
  if (document.readyState === 'complete') {
    setTimeout(callback); // Asynchronously call callback
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
};

exports.createDocumentFragmentFromHtml = function(html) {
  var div = document.createElement('div');
  div.innerHTML = html;
  var fragment = document.createDocumentFragment();
  while (div.firstChild) {
    fragment.appendChild(div.firstChild); // Appending to the fragment removes from the div
  }
  return fragment;
};

exports.isNode = function(object) {
  return object && typeof object.nodeType === 'number';
};

exports.isElement = function(object) {
  return (
    exports.isNode(object) &&
    (object instanceof HTMLElement ||
      object.nodeType === Node.ELEMENT_NODE ||
      object.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
  );
};

exports.isTextNode = function(object) {
  return exports.isNode(object) && object.nodeType === Node.TEXT_NODE;
};

exports.extractStringFromElement = function(selector) {
  var string = null;

  var candidateElements = document.querySelectorAll(selector);
  var candidateElement = array.last(candidateElements);
  if (candidateElement) {
    if (typeof candidateElement.textContent === 'string') {
      string = candidateElement.textContent.trim();
      if (string.length === 0) string = null;
    }

    if (string === null) {
      if (typeof candidateElement.value === 'string') {
        string = candidateElement.value.trim();
        if (string.length === 0) string = null;
      }
    }
  }

  if (!string && arguments.length > 1) {
    var rest = Array.prototype.slice.call(arguments, 1);
    return exports.extractStringFromElement(rest);
  } else {
    return string;
  }
};
