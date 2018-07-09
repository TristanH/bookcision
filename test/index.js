var httpInterception = require('test/httpInterception');

var amazonScraper = require('excisor/amazonScraper');
var data = require('test/data/data.js');

describe('bookcision', function() {
  var sandbox, findAsinStub;
  before(function setupStubs() {
    sandbox = sinon.sandbox.create();

    findAsinStub = sandbox.stub(amazonScraper, 'findASIN');
    findAsinStub.returns(data.pinker.asin);
  });

  after(function teardownStubs() {
    sandbox.restore();
  });

  beforeEach(httpInterception.enable);

  afterEach(httpInterception.disable);

  // @TODO Write-up work left to do for code coverage and remove junk code.
  // after(function() {
  //   require("coverjs-loader").reportHtml();
  // });

  // @TODO Temporarily have to list every test here... figure out how to wildcard this.
  // http://dontkry.com/posts/code/single-page-modules-with-webpack.html - see "auto-loading tests"

  // Dependency tests

  require('./dependencies/param-case');

  // Spec tests

  require('./specs/lib/scrape.test');
  require('./specs/lib/array.test');
  require('./specs/lib/functional.test');

  require('./specs/excisor/Book.test');
  require('./specs/excisor/BookScraper.test');
  require('./specs/excisor/Highlight.test');

  require('./specs/excisor/amazonScraper.test');

  require('./specs/lib/browser/applicationStorage.test');
  require('./specs/lib/applicationGlobal.test');

  // Integration tests

  require('./integration/book-to-html');
});
