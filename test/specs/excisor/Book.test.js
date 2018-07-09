var path = require('path');

var Book = require('excisor/Book');
var BookScraper = require('excisor/BookScraper');
var allTestData = require('test/data/data.js');
var data = allTestData.pinker;

describe('Book', function() {
  describe('#constructor', function() {
    it('defines all the properties a book template needs', function() {
      var book = new Book(data.asin, data.title, data.authors, data.highlights);

      book.should.have.property('asin', data.asin);
      book.should.have.property('title', data.title);
      book.should.have.property('authors', data.authors);
      book.should.have
        .property('highlights')
        .eql(data.highlights)
        .with.lengthOf(data.highlights.length);
    });
  });

  describe('.get()', function() {
    describe('gracefully fails when', function() {
      var doneCallback, failCallback, expectedExceptionType;

      function setupStubs(done) {
        doneCallback = sinon.spy(function() {
          done();
        });
        failCallback = sinon.spy(function() {
          done();
        });
      }

      afterEach(function checkFailureCallback() {
        assert(doneCallback.callCount === 0);
        assert(failCallback.calledOnce);

        var err = failCallback.args[0][0];
        err.should.be.instanceOf(expectedExceptionType);
      });

      it(
        'cannot find title' /*, function(done) {
        setupStubs(done);
        expectedExceptionType = Book.NotFoundError;

        Book.get(
          data.asin,
          doneCallback,
          failCallback
        );
      }*/
      );

      it(
        'cannot find author' /*, function(done) {
        setupStubs(done);
        expectedExceptionType = Book.NotFoundError;

        Book.get(
          data.asin,
          doneCallback,
          failCallback
        );
      }*/
      );

      it('cannot find asin', function(done) {
        setupStubs(done);
        expectedExceptionType = Book.NotFoundError;

        Book.get(null, doneCallback, failCallback);
      });

      it('gets error response from server', function(done) {
        setupStubs(done);
        expectedExceptionType = BookScraper.ScrapeError;

        Book.get('garbageasin', doneCallback, failCallback);
      });
    });

    describe('succeeds when', function() {
      var book;
      var doneCallback, failCallback;

      beforeEach(function setupStub(done) {
        doneCallback = sinon.spy(function(s) {
          done();
        });
        failCallback = sinon.spy(function(e) {
          done();
        });

        Book.get(data.asin, doneCallback, failCallback);
      });

      it('passes a Book instance on success', function() {
        assert(failCallback.callCount === 0);
        assert(doneCallback.calledOnce);

        var book = doneCallback.args[0][0];
        book.should.be.instanceOf(Book);
      });

      it('retrieved the book highlights', function() {
        var book = doneCallback.args[0][0];
        // console.log(book);
        book.should.have.property('asin', data.asin);
        book.should.have.property('title', data.title);
        book.should.have.property('authors', data.authors);
        book.should.have
          .property('highlights')
          .with.lengthOf(data.highlightsCount);
      });
    });
  });
});
