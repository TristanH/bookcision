var scrape = require('lib/scrape');
var util = require('util');
var $ = require('cheerio');
var Highlight = require('excisor/Highlight');
var url = require('url');
var string = require('lib/string');
var amazonScraper = require('excisor/amazonScraper');
var entities = require('entities');

function log() {
  // console.log.apply(null, arguments);
}

function BookScraper(options) {
  if (!options.asin) {
    throw new Error('Must specify an asin.');
  }

  this.options = options;

  var defaultHostname = 'read.amazon.com';
  if (TEST) {
    this.host = options.hostnameOverride_TESTONLY || defaultHostname;
  } else {
    this.host = location.hostname || defaultHostname;
  }

  this.scrapedData = {
    asin: options.asin,
    title: null,
    authors: null,
    highlights: [],

    contentLimitState: null,
    nextPageStartToken: null,
  };

  this.queueNextChunkScraping();
}

BookScraper.prototype.queueNextChunkScraping = function() {
  var index = this.scrapedData.highlights.length;

  log('queue next chunk w/ ' + index + ' highlights already.');
  log(
    'amazonScraper.getAmazonDeviceType(): ',
    amazonScraper.getAmazonDeviceType()
  );

  var url;
  if (this.scrapedData.nextPageStartToken) {
    url = util.format(
      'https://%s/kp/notebook?asin=%s&contentLimitState=%s&token=%s',
      this.host,
      this.options.asin,
      this.scrapedData.contentLimitState,
      this.scrapedData.nextPageStartToken
    );
  }
  else {
    url = util.format(
      'https://%s/kp/notebook?purpose=NOTEBOOK&amazonDeviceType=%s&appName=notebook&asin=%s&contentLimitState=&',
      this.host,
      amazonScraper.getAmazonDeviceType(),
      this.options.asin
    );
  }
   


  if (index !== 0) {
    url += '&index=' + index;
  }

  this.scrapeChunk(index, url);
};

BookScraper.prototype.onChunkScraped = function(
  asin,
  title,
  authors,
  highlights,
  contentLimitState,
  nextPageStartToken
) {
  var that = this;
  that.scrapedData.title = that.scrapedData.title || title;
  that.scrapedData.authors = that.scrapedData.authors || authors;
  that.scrapedData.contentLimitState = contentLimitState;
  that.scrapedData.nextPageStartToken = nextPageStartToken;

  if (highlights && highlights.length > 0) {
    log(
      'onChunkScraped: found ' +
        highlights.length +
        ' highlights' +
        ' on the existing ' +
        that.scrapedData.highlights.length +
        ' highlights.'
    );

    if (TEST) {
      highlights.forEach(function(highlight, index) {
        highlights.forEach(function(currentHighlight, currentIndex) {
          if (
            highlight !== currentHighlight &&
            highlight.location.value === currentHighlight.location.value &&
            highlight.text === currentHighlight.text
          ) {
            // log('Found duplicate highlight with location value: ' + highlight.location.value);
            // log('First duplicate: ', highlight);
            // log('Next duplicate: ', currentHighlight);
            log(highlights);
            throw new Error(
              'Found duplicate highlight with location value: ' +
                highlight.location.value +
                ' first location: ' +
                index +
                ' and duplicate location ' +
                currentIndex
            );
          }
        });
      });

      highlights.forEach(function(highlight) {
        that.scrapedData.highlights.forEach(function(scrapedHighlight) {
          if (highlight.location.value === scrapedHighlight.location.value) {
            // log('Found duplicate highlight with location value: ' + highlight.location.value);
            throw new Error(
              'Found duplicate highlight with location value: ' +
                highlight.location.value
            );
          }
        });
      });

      log('First highlight: ', highlights[0]);
      log('Last highlight: ', highlights[highlights.length - 1]);
    }

    that.scrapedData.highlights = that.scrapedData.highlights.concat(
      highlights
    );
    // We got some highlights so make another request
    that.queueNextChunkScraping();
  } else if (that.options.doneCallback) {
    log('onChunkScraped: found 0 highlights, calling doneCallback');
    // We got no highlights from this request so we must have reached the end of the highlights
    that.options.doneCallback(
      that.scrapedData.asin,
      that.scrapedData.title,
      that.scrapedData.authors,
      that.scrapedData.highlights
    );
  }
};

BookScraper.prototype.scrapeChunk = function(index, url) {
  log(url);

  var that = this;
  var options = this.options;

  log(JSON.stringify(options));

  scrape(
    url,
    function(scraper) {
      var highlights = [];
      var title, authors;
      var contentLimitState, nextPageStartToken;

      if (options.failCallback) {
        scraper.on('error', function(err) {
          options.failCallback(new BookScraper.ScrapeError(err));
        });
      }

      scraper.on('dom', function() {
        that.onChunkScraped(options.asin, title, authors, highlights, contentLimitState, nextPageStartToken);
      });

      // <h3 class="a-spacing-top-small a-color-base kp-notebook-selectable kp-notebook-metadata">The Blank Slate: The Modern Denial of Human Nature</h3>
      var foundTitle = scraper.select(
        '.a-spacing-top-small.a-color-base.kp-notebook-selectable.kp-notebook-metadata',
        function(titleLink) {
          title = $(titleLink).text().trim();
          title = entities.decodeHTML(title);
          log('found title: ' + title);
          if (options.onTitle) {
            // console.log('about to call onTitle with: ' + title);
            options.onTitle(title);
          }
          scraper.removeListener('element', foundTitle);
        }
      );

      // <h1 class="a-size-base a-spacing-top-micro a-color-secondary kp-notebook-selectable kp-notebook-metadata">Steven Pinker</h1>
      var foundAuthors = scraper.select(
        '.a-size-base.a-spacing-top-micro.a-color-secondary.kp-notebook-selectable.kp-notebook-metadata',
        function(authorsSpan) {
          authors = $(authorsSpan).text().trim();
          authors = entities.decodeHTML(authors);
          authors = string.startsWith(authors, 'by ')
            ? authors.substring(3)
            : authors;
          if (options.onAuthors) {
            options.onAuthors(authors);
          }
          scraper.removeListener('element', foundAuthors);
        }
      );

      scraper.select(
        '.kp-notebook-content-limit-state',
        function(clsInput) {
          contentLimitState = clsInput.attribs['value'];
        }
      );
      scraper.select(
        '.kp-notebook-annotations-next-page-start',
        function(clsInput) {
          nextPageStartToken = clsInput.attribs['value'];
        }
      );

      // div#kp-notebook-annotations div
      //   Location:
      //     - <input type="hidden" name="" value="6498" id="kp-annotation-location">
      //   Note:
      //     - No note: <span id="note" class="a-size-base-plus a-color-base"></span>
      //     - Note:    <span id="note" class="a-size-base-plus a-color-base">this is why behavior analysis is still useful and valid</span>
      //   Highlight:
      //     - Highlight: <span id="highlight" class="a-size-base-plus a-color-base">expropriate</span>
      var selector =
        index === 0
          ? '#kp-notebook-annotations > div'
          : 'div.a-row.a-spacing-base';
      scraper.select(selector, function(highlightContainer) {
        var noteElement = $(highlightContainer).find('span#note:not(:empty)');
        var noteText = $(noteElement).text().trim();
        noteText = entities.decodeHTML(noteText);
        var hasNote = Boolean(noteText && string.isNotEmpty(noteText));

        var highlightElement = $(highlightContainer).find(
          'span#highlight:not(:empty)'
        );
        var highlightText = $(highlightElement).text().trim();
        highlightText = entities.decodeHTML(highlightText);
        var hasHighlight = Boolean(
          highlightText && string.isNotEmpty(highlightText)
        );

        var isNoteOnly = hasNote && !hasHighlight;

        var locationElement = $(highlightContainer).find(
          '#kp-annotation-location'
        );
        var locationText = $(locationElement).val();
        var locationValue = parseInt(locationText, 10);

        var kindleUrl = util.format(
          'kindle://book?action=open&asin=%s&location=%d',
          that.options.asin,
          locationValue
        );

        // -------------------------------

        if (hasNote || hasHighlight) {
          var highlight = new Highlight({
            text: highlightText,
            isNoteOnly: isNoteOnly,
            location: {
              url: kindleUrl,
              value: locationValue
            },
            note: hasNote ? noteText : null
          });

          // Filter out duplicate highlights since I can't make heads or tails out of how to get the API to return the right # of items
          var alreadyExists = that.scrapedData.highlights.some(function(
            scrapedHighlight
          ) {
            return Highlight.isEqual(scrapedHighlight, highlight);
          });
          if (!alreadyExists) {
            highlights.push(highlight);

            if (options.onHighlight) {
              options.onHighlight(highlight);
            }
          }
        }
      });

    }.bind(this)
  );
};

module.exports = BookScraper;

var EE = require('extended-exceptions');
BookScraper.ScrapeError = EE.create_custom_error(
  'BookScraperScrapeError',
  EE.RuntimeError
);
