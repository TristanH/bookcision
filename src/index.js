var browserSupport = require('lib/browser/browserSupport');
if (!browserSupport.meetsMinimumRequirements) {
  var showUpgradeInstructions = confirm(
    'Sorry, bookcision only supports modern browsers. Would you like instructions on how to upgrade?'
  );
  if (showUpgradeInstructions) {
    window.open('http://browsehappy.com/', '_blank');
  }
} else {
  var packageInfo = require('package.json');
  var rollbar = require('lib/rollbar.js'); // Enable rollbar integration before anything else.
  var applicationGlobal = require('lib/applicationGlobal');
  if (!applicationGlobal.initialized) {
    require('lib/polyfills');

    // Store package.json in localStorage. Will allow us to detect on the client that we've
    // upgraded the script and who knows what else.
    var getApplicationStorage = require('lib/browser/applicationStorage');
    var applicationStorage = getApplicationStorage(packageInfo.name);
    applicationStorage.set('package.json', packageInfo);

    applicationGlobal.initialized = true;
  }

  var dom = require('lib/browser/dom');
  var feedback = require('lib/ui/components/feedback');
  var ModalDialog = require('lib/ui/components/ModalDialog');

  var amazonScraper = require('excisor/amazonScraper');

  require('lib/stylesheets/bootstrap.less'); // Make bootstrap CSS available from get-go
  require('lib/stylesheets/font-awesome.less'); // Make bootstrap CSS available from get-go

  var isLocalhostDevelopment = DEBUG && location.hostname === 'localhost';
  if (!isLocalhostDevelopment) {
    require('vendor/googleAnalytics');
  }

  var enhancedBookTemplate = require('excisor/templates/book.jade.js');
  var Book = require('excisor/Book');
  var BookScraper = require('excisor/BookScraper');

  var displayModalDialogForBook = function(book) {
    feedback('Done', 100); // @TODO temporary...
    var fragment = enhancedBookTemplate.getFragment(book);
    new ModalDialog(fragment);
  };

  var failCallback = function(error) {
    if (error instanceof Book.NotFoundError) {
      feedback('Please navigate to a specific book and try again.', 99.999); // @TODO temporary...
      rollbar.info('Activated on a non-book page.', error);
    } else if (error instanceof BookScraper.ScrapeError) {
      feedback(
        'Error retrieving highlights from Amazon, please try again...',
        99.999
      ); // @TODO temporary...
      rollbar.warning('Scrape failure.', error);
    } else {
      feedback(error, 99.999); // @TODO temporary...
    }
  };

  dom.onDocumentReady(function OnContentLoaded() {
    if (!DEBUG && location.hostname.indexOf('read.amazon.') !== 0) {
      feedback(
        'Go to read.amazon.com/notebook (or read.amazon.co.jp, read.amazon.co.uk, etc.) to start.',
        99.999
      );
    } else {
      var asin;

      if (isLocalhostDevelopment) {
        asin = 'B004LROUW2';
      } else {
        asin = amazonScraper.findASIN();
      }

      feedback('Loading highlights', 75); // @TODO temporary...

      Book.get(asin, displayModalDialogForBook, failCallback);

      // @TODO Need to make failCallback get called in case of exceptions being thrown in Book code.
    }
  });
}
