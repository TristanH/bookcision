var Parser = require('htmlparser2').WritableStream,
  Cornet = require('cornet'),
  http = require('http'),
  hyperquest = require('hyperquest');

function scrape(url, setupHook) {
  // console.log('scraping: ' + url);
  var cornet = new Cornet();

  if (setupHook) {
    setupHook(cornet);
  }

  var req = hyperquest.get(url);

  req.pipe(new Parser(cornet));

  req.on('response', function(res) {
    var status = res.statusCode;
    if (status < 200 || status >= 300) {
      var err = Error(
        'Received status code ' +
          status +
          ' ("' +
          http.STATUS_CODES[status] +
          '")'
      );
      req.emit('error', err);
    }
  });

  req.on('error', function(err) {
    cornet.emit('error', err);
  });

  return cornet;
}

module.exports = scrape;
