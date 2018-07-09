// @TODO should this file be in the 'templates' directory?

var bookTextTemplate = require('excisor/templates/book.txt.handlebars'),
  bookXmlTemplate = require('excisor/templates/book.xml.handlebars');

var bookHtmlTemplate = require('excisor/templates/book.jade');

require('excisor/stylesheets/book.less');
require('excisor/stylesheets/highlight.less');
require('excisor/stylesheets/button-with-dropdown.less');
require('excisor/stylesheets/buttons.less');

var templateEnhancer = require('excisor/templateEnhancer');
var SimplifiedFile = require('lib/browser/SimplifiedFile');
var feedback = require('lib/ui/components/feedback');
var css = require('lib/ui/css');
var ClipboardButton = require('lib/ui/components/ClipboardButton');

var downloadableFormats = {
  text: {
    extension: 'txt',
    mimetype: 'text/plain',
    getFileContentsForDownload: bookTextTemplate
  },
  xml: {
    extension: 'xml',
    mimetype: 'application/xml',
    getFileContentsForDownload: bookXmlTemplate
  },
  json: {
    extension: 'json',
    mimetype: 'application/json',
    getFileContentsForDownload: function(data) {
      return JSON.stringify(data);
    }
  }
};

var getCleanFilename = function(filename) {
  var withoutWhitespace = filename.replace(/\s+/g, '.');
  var onlyWordCharacters = withoutWhitespace.replace(/[^\w.]/g, '');
  return onlyWordCharacters;
};

var downloadBook = function(book, format) {
  if (!(format in downloadableFormats)) throw 'Unknown format specified.';

  feedback('Writing highlights to file', 50);

  var content = downloadableFormats[format].getFileContentsForDownload(book);
  var mimetype = downloadableFormats[format].mimetype;
  var fileName =
    'Kindle.Highlights_' +
    getCleanFilename(book.title) +
    '_' +
    String(Date.now()) +
    '.' +
    downloadableFormats[format].extension;

  var file = new SimplifiedFile(fileName, mimetype, content);

  file.download();
  feedback('Highlights written.', 100);
};

module.exports = templateEnhancer(bookHtmlTemplate, {
  events: [
    {
      selector: '.bookcision-download-as-text',
      event: 'click',
      handler: function(book, event) {
        downloadBook(book, 'text');
      }
    },
    {
      selector: '.bookcision-download-as-xml',
      event: 'click',
      handler: function(book, event) {
        downloadBook(book, 'xml');
      }
    },
    {
      selector: '.bookcision-download-as-json',
      event: 'click',
      handler: function(book, event) {
        downloadBook(book, 'json');
      }
    },
    {
      selector: '.dropdown-toggle',
      event: 'click',
      handler: function(book, event) {
        var dropdownList = event.currentTarget.parentNode.querySelector(
          '.dropdown-toggle + ul'
        );
        dropdownList.style.display = dropdownList.style.display !== 'block'
          ? 'block'
          : 'none';
      }
    }
  ],
  onAfterFragmentGenerated: function(book, fragment) {
    var dropdownToggle = fragment.querySelector('.dropdown-toggle');
    var dropdownList = fragment.querySelector('.dropdown-toggle + ul');

    // @TODO Remove the event listener from the document body when the dropdown is removed from the DOM
    // if the user clicks outside of the ul element, hide it
    if (dropdownToggle && dropdownList) {
      document.body.addEventListener('click', function(clickEvent) {
        if (!dropdownToggle.contains(clickEvent.target))
          dropdownList.style.display = 'none';
      });
    }

    // Light up copy-to-clipboard functionality on the copy button
    var copyToClipboardButton = fragment.querySelector(
      '.bookcision-copy-to-clipboard'
    );
    if (copyToClipboardButton) {
      var clipboardContent = bookTextTemplate(book);
      var clipboardCallbacks = {
        complete: function() {
          button.flash({ icon: 'icon-ok' });
        }
      };
      var button = new ClipboardButton(
        copyToClipboardButton,
        clipboardContent,
        clipboardCallbacks
      );
    }
  }
});
