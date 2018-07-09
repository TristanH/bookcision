var util = require('util');
var url = require('url');

var url = function() {};

url.getCurrentScriptUrl = function(scriptName) {
  var currentScript = url.getCurrentScript();
  return currentScript ? currentScript.src : null;
};

// Will not work with script tags where the src attribute doesn't end with the script name, such as if
// query parameters are used for cache-circumvention.
url.getCurrentScript = (function() {
  var strictScriptSelector = util.format('script[src$="%s"]', scriptName);

  return function(scriptName) {
    var script = null;

    var matchingScripts = document.querySelectorAll(strictScriptSelector);
    if (matchingScripts.length > 0) {
      script = array.last(matchingScripts);
    }

    return script;
  };
})();

module.exports = url;
