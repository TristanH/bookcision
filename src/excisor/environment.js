var packageInfo = require('package.json'),
  CurrentScript = require('lib/CurrentScript');

// @TODO Duplicated from ZeroClipboardWrapper.js
var debugSuffix = DEBUG ? '.debug' : '';
var scriptName = packageInfo.name + debugSuffix + '.js'; // @TODO Move this into the package?
var currentScript = new CurrentScript(scriptName);

switch (currentScript.parentDirectory()) {
  case 'dest':
    module.exports = 'development';
    break;
  case 'latest':
    module.exports = 'production';
    break;
  default:
    module.exports = 'staging';
}
