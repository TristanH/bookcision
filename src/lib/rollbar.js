var rollbar;

if (DEBUG) {
  var noop = function() {};
  rollbar = {
    critical: noop,
    error: noop,
    warning: noop,
    info: noop,
    debug: noop
  };
} else {
  var rollbarConfig = require('lib/rollbarConfig');
  rollbar = require('expose?rollbar!vendor/rollbar.require.js');

  var applicationGlobal = require('lib/applicationGlobal');
  // @TODO Duplicated btwn here and index.js, refactor out
  if (!applicationGlobal.rollbarInitialized) {
    rollbar.init(rollbarConfig);
    applicationGlobal.rollbarInitialized = true;
  }
}

module.exports = rollbar;
