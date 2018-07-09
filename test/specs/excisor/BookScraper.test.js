var BookScraper = require('excisor/BookScraper');
var Highlight = require('excisor/Highlight');
var testData = require('test/data/data.js');

describe('BookScraper', function() {
  describe('#constructor', function() {
    it('expects an argument', function() {
      (function() {
        new BookScraper();
      }.should.throw());
    });

    it('throws when no asin is specified', function() {
      (function() {
        new BookScraper({});
      }.should.throw());
    });

    it('succeeds when asin is specified', function() {
      (function() {
        new BookScraper({ asin: 'norequest' });
      }.should.not.throw());
    });
  });

  describe('intl support', function() {
    it('makes a request to the US kindle domain by default', function() {
      this.mitm.on('request', function(req) {
        req.headers.host.should.equal('read.amazon.com');
      });

      (function() {
        new BookScraper({ asin: 'norequest' });
      }.should.not.throw());
    });

    it('makes a request to the international kindle domain when originating there', function() {
      this.mitm.on('request', function(req) {
        req.headers.host.should.equal('read.amazon.co.jp');
      });

      (function() {
        new BookScraper({
          asin: 'norequest',
          hostnameOverride_TESTONLY: 'read.amazon.co.jp'
        });
      }.should.not.throw());
    });
  });

  describe('.select()', function() {
    it('can select the title, highlights, and authors', function(done) {
      testData.pinker.asin.should.equal('B000QCTNIM');

      var callbacks = {
        onTitle: function() {},
        onAuthors: function() {},
        onHighlight: function() {}
      };

      var spy = sinon.spy();
      var callbackMocks = sinon.mock(callbacks);
      callbackMocks.expects('onTitle').once().withArgs(testData.pinker.title);
      callbackMocks
        .expects('onAuthors')
        .once()
        .withArgs(testData.pinker.authors);

      testData.pinker.highlights.forEach(function(rawHighlight) {
        var highlight = new Highlight(rawHighlight);
        callbackMocks.expects('onHighlight').withArgs(highlight);
      });

      // // Make sure we get called once for every highlight not already accounted for
      // callbackMocks
      //   .expects('onHighlight')
      //   .exactly(
      //     testData.pinker.highlightsCount - testData.pinker.highlights.length
      //   );

      var doneWrapper = function(asin, title, authors, highlights) {
        asin.should.equal(testData.pinker.asin);

        title.should.equal(testData.pinker.title);
        authors.should.equal(testData.pinker.authors);

        callbackMocks.verify();
        done();
      };

      var bookScraper = new BookScraper({
        asin: testData.pinker.asin,
        doneCallback: doneWrapper,
        onTitle: callbacks.onTitle,
        onAuthors: callbacks.onAuthors,
        onHighlight: callbacks.onHighlight,
        onNote: callbacks.onNote
      });
    });
  });
});
