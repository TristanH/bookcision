var fs = require('fs');

var Book = require('excisor/Book');
var Highlight = require('excisor/Highlight');
var bookHtmlTemplate = require('excisor/templates/book.jade');

var allTestData = require('test/data/data.js');
var data = allTestData.pinker;

describe('Book-to-HTML', function() {
  var book;
  var doneCallback, failCallback;
  var generatedHtml;

  beforeEach(function getBook(done) {
    Book.get(
      data.asin,
      function(b) {
        book = b;
        done();
      },
      failCallback
    );
  });

  it('receives a book to work with', function() {
    book.should.be.instanceOf(Book);
  });

  it('generates non-empty string', function() {
    generatedHtml = bookHtmlTemplate(book);
    generatedHtml.should.not.be.empty;
  });

  it('generates html that matches the golden file', function() {
    // Write back goldenHtml file. Uncomment the following line to re-generate the golden HTML file which must then be manually re-validated as good.
    // fs.writeFileSync(data.htmlFile, generatedHtml, {encoding: 'utf8'});

    // console.log(generatedHtml);

    var goldenHtml = fs.readFileSync(data.htmlFile, { encoding: 'utf8' });
    generatedHtml.should.eql(goldenHtml);
  });
});
