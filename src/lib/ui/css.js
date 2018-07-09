var paramCase = require('param-case');
var vibe = require('vibe');
var fade = require('fade');

var propertySuffixes = {
  top: 'px',
  bottom: 'px',
  left: 'px',
  right: 'px',
  width: 'px',
  height: 'px',
  'font-size': 'px',
  margin: 'px',
  'margin-top': 'px',
  'margin-bottom': 'px',
  'margin-left': 'px',
  'margin-right': 'px',
  padding: 'px',
  'padding-top': 'px',
  'padding-bottom': 'px',
  'padding-left': 'px',
  'padding-right': 'px'
};

// Helper functions

// Css class
function Css(element) {
  this.element = element;
}

Css.prototype.apply = function() {
  var styles = null;

  // Support single properties - apply(property, value)
  if (arguments.length === 2) {
    styles = {};
    styles[arguments[0]] = arguments[1];
  } else {
    // Support multiple properties - apply({property1:value1, property2:value2})
    styles = arguments[0];
  }

  var cssStyleDeclaration = this.element.style;
  for (var property in styles) {
    if (styles.hasOwnProperty(property)) {
      var cssProperty = paramCase(property);
      var value = styles[property];

      var cssValue;
      if (
        typeof value === 'number' &&
        propertySuffixes.hasOwnProperty(cssProperty)
      )
        cssValue = String(value) + propertySuffixes[cssProperty];
      else cssValue = value;

      cssStyleDeclaration.setProperty(cssProperty, cssValue);
    }
  }

  return this;
};

Css.prototype.getUsedValue = function(property) {
  var style = getComputedStyle(this.element);
  var value = style[property];
  if (value) {
    var valueAsFloat = parseFloat(value);
    return isNaN(valueAsFloat) ? value : valueAsFloat;
  }

  return null;
};

Css.prototype.addClass = function(className) {
  vibe.addClass(this.element, className);
  return this;
};

Css.prototype.removeClass = function(className) {
  vibe.removeClass(this.element, className);
  return this;
};

Css.prototype.toggleClass = function(className) {
  vibe.toggleClass(this.element, className);
  return this;
};

Css.prototype.hasClass = function(className) {
  return vibe.hasClass(this.element, className);
};

(function() {
  var fadeInOrOut = function(inOrOutMethod) {
    return function(duration, callback) {
      fade[inOrOutMethod](this.element, duration);
      setTimeout(callback, duration);
    };
  };

  Css.prototype.fadeOut = fadeInOrOut('out');

  Css.prototype.fadeIn = fadeInOrOut('in');
})();

// return convenience function for constructor
module.exports = function(element) {
  return new Css(element);
};
