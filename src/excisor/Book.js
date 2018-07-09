// Current schema:
// {
//   "asin": "B00AA36R4U",
//   "title": "CLR via C# (Microsoft, Developer Reference)",
//   "authors": "Jeffrey Richter",
//   "highlights": [array of Highlight objects]
// }

var Highlight = require('excisor/Highlight');
var BookScraper = require('excisor/BookScraper');
var amazonScraper = require('excisor/amazonScraper');

// @TODO Investigate switching to promises

var Book = function(asin, title, authors, highlights) {
  this.asin = asin;
  this.title = title;
  this.authors = authors;
  this.highlights = highlights;
};

module.exports = Book;

Book.get = function(asin, doneCallback, failCallback) {
  if (DEBUG && location.hostname === 'localhost') {
    var title = '1Q84';
    var authors = 'Haruki Murakami, Jay Rubin, Philip Gabriel';
    var testData = require('test/data/data.js');

    var highlights = testData.pinker.highlights.map(function(rawHighlight) {
      return new Highlight(rawHighlight);
    });

    var book = new Book(asin, title, authors, highlights);

    doneCallback(book);
  } else if (!asin) {
    failCallback(
      new Book.NotFoundError("Missing 'asin,' 'title,' or 'authors' field")
    );
  } else {
    new BookScraper({
      asin: asin,
      doneCallback: function(asin, title, authors, highlights) {
        var book = new Book(asin, title, authors, highlights);
        doneCallback(book);
      },
      failCallback: failCallback
    });
  }
};

var EE = require('extended-exceptions');
Book.NotFoundError = EE.create_custom_error(
  'BookNotFoundError',
  EE.RuntimeError
);
