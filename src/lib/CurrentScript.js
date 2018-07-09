var util = require('util'),
  array = require('lib/array'),
  url = require('url');

// Will not work with script tags where the src attribute doesn't end with the script name, such as if
// query parameters are used for cache-circumvention.
var CurrentScript = function(scriptName) {
  // Find the current script by searching the script tags on the page.
  this.script = null;
  var strictScriptSelector = util.format('script[src$="%s"]', scriptName);
  var matchingScripts = document.querySelectorAll(strictScriptSelector);
  if (matchingScripts.length > 0) {
    this.script = array.last(matchingScripts);
  }

  if (!this.script) throw 'Could not find the current script ' + scriptName;

  if (!this.script.src || this.script.src === '') throw 'Invalid script found';

  this.url = url.parse(this.script.src, true, true);
};

CurrentScript.prototype.parentDirectory = function() {
  var pathname = this.url.pathname;
  var segments = pathname.split('/');

  if (segments.length < 2)
    throw new Error(
      'Error parsing parent directory of url ' + this.url.toString()
    );

  return segments[segments.length - 2];
};

CurrentScript.prototype.resolveUrlRelativeTo = function(relativeUrl) {
  return url.resolve(this.script.src, relativeUrl);
};

CurrentScript.prototype.getOrigin = function() {
  var scriptUrl = url.parse(this.script.src);
  return scriptUrl.protocol + '//' + scriptUrl.host;
};

module.exports = CurrentScript;
