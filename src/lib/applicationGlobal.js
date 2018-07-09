var packageInfo = require('package.json');

module.exports = function global() {
  // Initialize global namespace (package name) if necessary
  var packageKey = '_' + packageInfo.name + '_Globals';
  global[packageKey] = global[packageKey] || {};

  return global[packageKey];
};
