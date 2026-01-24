var Parser = require('htmlparser2').Parser,
  Cornet = require('cornet');

// Detect if we're in a browser environment with fetch support
var isBrowser = typeof window !== 'undefined' && typeof window.fetch === 'function';

// Use native fetch in browser, node-fetch in Node.js
var fetch = isBrowser ? window.fetch : require('node-fetch');

function scrape(url, setupHook) {
  // console.log('scraping: ' + url);
  var cornet = new Cornet();

  if (setupHook) {
    setupHook(cornet);
  }

  var fetchOptions = {
    method: 'GET',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  };

  // Include cookies for same-origin requests in browser
  if (isBrowser) {
    fetchOptions.credentials = 'same-origin';
  }

  fetch(url, fetchOptions)
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Received status code ' + response.status + ' ("' + response.statusText + '")');
      }
      return response.text();
    })
    .then(function(html) {
      // Parse the HTML and emit events to cornet
      var parser = new Parser(cornet, { decodeEntities: false });
      parser.write(html);
      parser.end();
    })
    .catch(function(err) {
      cornet.emit('error', err);
    });

  return cornet;
}

module.exports = scrape;
