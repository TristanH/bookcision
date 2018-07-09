var scrape = require('lib/scrape');
var $ = require('cheerio');

describe('scrape', function() {
  var mitm;
  var data = {
    title: 'fb55 (Felix Böhm)',
    repositories: [
      'htmlparser2',
      'readabilitySAX',
      'CSSselect',
      'entities',
      'node-cornet',
      'cheerio',
      'dom-serializer',
      'htmlparser-benchmark',
      'cqs',
      'node-level-mapped-index'
    ]
  };

  it('emits "error" when http request fails', function(done) {
    scrape('http://read.amazon.com/garbageasin', function(scraper) {
      scraper.on('error', function() {
        done();
      });
    });
  });

  it('only emits "error" and not "dom" when http request fails', function(
    done
  ) {
    scrape('http://read.amazon.com/garbageasin', function(scraper) {
      scraper.on('dom', function() {
        done("Shouldn't have received 'dom' event in error case");
      });
      scraper.on('error', function() {
        done();
      });
    });
  });

  describe('.select()', function() {
    it('can select the title element', function(done) {
      scrape('http://github.com/fb55', function(scraper) {
        scraper.on('dom', function() {
          done();
        });

        var onTitle = scraper.select('title', function(title) {
          $(title).text().trim().should.equal(data.title);
          scraper.removeListener('element', onTitle);
        });
      });
    });

    it('can select multiple child elements', function(done) {
      scrape('http://github.com/fb55', function(scraper) {
        scraper.on('dom', function() {
          done();
        });

        var i = 0;
        scraper.select('ul.repo-list span.repo', function(elem) {
          $(elem).text().trim().should.equal(data.repositories[i++]);
        });
      });
    });
  });
});
