var packageInfo = require('package.json');
var rollbar = require('rollbar.json');
var amazonScraper = require('excisor/amazonScraper');
var environment = require('excisor/environment');

var _rollbarConfig = {
  accessToken: rollbar.client_access_token,
  captureUncaught: true,
  payload: {
    environment: environment,
    client: {
      javascript: {
        source_map_enabled: true,
        code_version: packageInfo.version,
        guess_uncaught_frames: true
      }
    }
  }
};

// @TODO Ack, more excisor code in lib
var user = amazonScraper.findUser();
if (user) {
  _rollbarConfig.payload.person = {
    id: user.id,
    username: user.name
  };
}

module.exports = _rollbarConfig;
