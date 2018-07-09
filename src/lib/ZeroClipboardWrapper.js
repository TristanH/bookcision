var ZeroClipboard = require('ZeroClipboard'),
  packageInfo = require('package.json'),
  CurrentScript = require('lib/CurrentScript');

// @TODO There shouldn't be package specific code in lib directory
var debugSuffix = DEBUG ? '.debug' : '';
var scriptName = packageInfo.name + debugSuffix + '.js'; // @TODO Move this into the package?
var currentScript = new CurrentScript(scriptName);
var zeroClipboardUrl = currentScript.resolveUrlRelativeTo('ZeroClipboard.swf');
var trustedOrigins = [window.location.protocol + '//' + window.location.host];

ZeroClipboard.setDefaults({
  moviePath: zeroClipboardUrl,
  allowScriptAccess: 'always',
  trustedDomains: trustedOrigins, // Deprecated in a future version in favor of trustedOrigins
  trustedOrigins: trustedOrigins
});

// Limitation of ZeroClipboard/Flash => Requires that ZeroClipboard be global so that Flash can call back into it
// @TODO Use webpack expose-loader on ZeroClipboard
window.ZeroClipboard = module.exports = ZeroClipboard;
