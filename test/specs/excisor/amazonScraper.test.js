var path = require('path');

var amazonScraper = require('excisor/amazonScraper');
var testHtml = require('raw!../../data/B004LROUW2-19Q4__HOME.html');

// var jsdom = require("jsdom");

describe('amazonScraper', function() {
  describe('.findUser', function() {
    it('returns an object with a name');
  });
});

// var jsdom = require("jsdom");

// describe('amazonScraper', function() {
//   before(function setupDom(done) {
//     jsdom.env(
//       testHtml,
//       {
//         done: function (errors, window) {
//           global.window = window;
//           global.document = window.document;
//           global.$ = window.$;
//           done();
//         }
//       }
//     );
//   });

//   after(function teardownDom() {
//     delete global.window;
//     delete global.document;
//     delete global.$;
//   });

//   describe('findUser', function() {
//     it('returns an object with a name', function() {
//       amazonScraper.findUser().should.have.property('name');
//     });
//   });
// });

// var path = require("path");

// var amazonScraper = require("excisor/amazonScraper");
// var testHtml = require("raw!../../data/B004LROUW2-19Q4__HOME.html");

// var cheerio = require("cheerio");

// describe('amazonScraper', function() {
//   before(function setupDom(done) {
//     var $ = cheerio.load(testHtml);
//     global.document = {
//       querySelector: function(selector) {
//         return $(selector).first();
//       },
//       querySelectorAll: function() {
//         return $(selector);
//       }
//     };
//     global.$ = $;
//     done();
//   });

//   after(function teardownDom() {
//     // delete global.window;
//     delete global.document;
//     delete global.$;
//   });

//   describe('findUser', function() {
//     it('returns an object with a name', function(done) {
//       var el = document.querySelector('.greeting a[href^="/profile"]');
//       console.log(el);
//       amazonScraper.findUser().should.have.property('name');
//     });
//   });
// });
