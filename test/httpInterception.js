var Mitm = require('mitm');
var fs = require('fs');

var data = require('test/data/data.js');

function log() {
  // console.log.apply(null, arguments);
}

module.exports.enable = function enableHttpInterception() {
  this.mitm = Mitm();

  // @TODO Verify the mitm fn is used.
  // @TODO Verify the request URL is correct.
  this.mitm.on('request', function(req, res) {
    log('Received request for ' + req.url);
    var highlightsFile;
    var shouldSucceed = true;

    if (req.url === '/fb55') {
      highlightsFile = 'test/data/fb55.html';
    } else if (req.url.indexOf('asin=norequest') !== -1) {
      highlightsFile = null;
    } else if (req.url.indexOf(data.pinker.asin) !== -1) {
      if (req.url.indexOf('index=') === -1) {
        highlightsFile = data.pinker.highlightsFiles[0];
        log('Fileeeee: ' + highlightsFile);
      } else if (req.url.indexOf('index=3') !== -1) {
        highlightsFile = data.pinker.highlightsFiles[1];
      } else if (req.url.indexOf('index=5') !== -1) {
        highlightsFile = data.pinker.highlightsFiles[2];
      } else {
        throw new Error('Invalid URL requested: ' + req.url);
      }
    } else if (req.url.indexOf('garbageasin') !== -1) {
      shouldSucceed = false;
    } else {
      throw new Error(
        'Unexpected http request to ' +
          req.url +
          " made. Don't know how to respond."
      );
    }

    res.statusCode = shouldSucceed ? 200 : 500;

    log('Will respond with success?: ' + (shouldSucceed ? 'yes' : 'no'));
    log('Will respond with highlights file: ' + highlightsFile);

    // Send contents of highlights file as response
    if (shouldSucceed && highlightsFile) {
      var htmlStream = fs.createReadStream(highlightsFile);
      htmlStream.pipe(res);
    } else {
      res.end('No highlights. =[');
    }
  });
};

module.exports.disable = function disableHttpInterception() {
  this.mitm.disable();
};
