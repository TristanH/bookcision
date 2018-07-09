var css = require('lib/ui/css');

// @TODO Comb through project and see if we need more here ...
var shouldBeDefinedAndNotNull = [
  localStorage,
  document.querySelector,
  document.documentElement,
  Array.prototype.forEach,
  Array.prototype.filter,
  Function.prototype.bind
];

// Add properties whose objects may not be defined in older browsers
if (typeof Node !== 'undefined')
  shouldBeDefinedAndNotNull.push(Node.ELEMENT_NODE);

var shouldBeDefined = [document.documentElement.nextElementSibling];

// Can't use Array.prototype.every since we're testing compatibility
var meetsMinimumRequirements = true;
for (
  var i = 0;
  meetsMinimumRequirements && i < shouldBeDefinedAndNotNull.length;
  i++
) {
  meetsMinimumRequirements =
    typeof shouldBeDefinedAndNotNull[i] !== 'undefined' &&
    shouldBeDefinedAndNotNull[i] !== null;
}
for (var i = 0; meetsMinimumRequirements && i < shouldBeDefined.length; i++) {
  meetsMinimumRequirements = typeof shouldBeDefined[i] !== 'undefined';
}

if (!meetsMinimumRequirements) {
  module.exports = {
    meetsMinimumRequirements: false,
    featuresWithFallbacks: {}
  };
} else {
  var featuresWithFallbacks = {
    'file-system': function() {
      return new Blob();
    }
  };

  // Add CSS classes to the document root to enable hiding/showing elements more conveniently from CSS
  var rootNode = document.documentElement;
  Object.keys(featuresWithFallbacks).forEach(function(feature) {
    var isFeatureSupported;
    try {
      isFeatureSupported = Boolean(featuresWithFallbacks[feature]());
    } catch (e) {}
    var prefix = isFeatureSupported === true ? '' : 'no-';
    css(rootNode).addClass(prefix + feature);
  });

  module.exports = {
    meetsMinimumRequirements: meetsMinimumRequirements,
    featuresWithFallbacks: featuresWithFallbacks
  };
}
