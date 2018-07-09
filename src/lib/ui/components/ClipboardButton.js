var util = require('util'),
  css = require('lib/ui/css'),
  Button = require('lib/ui/components/Button'),
  ZeroClipboard = require('lib/ZeroClipboardWrapper');

function ClipboardButton(element, clipboardContent, callbacks) {
  Button.call(this, element);

  var bootstrapButtonClasses = {
    hoverClass: 'hover',
    activeClass: 'active'
  };
  var clipboard = new ZeroClipboard(this._element, bootstrapButtonClasses);
  var buttonElement = this._element;

  var provideErrorMessageOnClipboardCopyAttempt = (function() {
    // @TODO Find a function utility in npm with a .once() function (or write one)
    var setOnce = false; // Make sure it only runs once, as it appears ZeroClipboard fires both the
    // noflash and wrongflash events in the case of there being no Flash Player,
    // and we don't want to bind two alerts to the button.

    return function(message) {
      if (!setOnce) {
        setOnce = true;
        clipboard.unglue(buttonElement);
        buttonElement.addEventListener('click', function() {
          alert(message);
        });
      }
    };
  })();

  // With ZeroClipboard, you can only have one handler per event, and
  // first handler wins, so register all passed-in handlers first to
  // allow them to take precedence.
  for (var callbackName in callbacks) {
    clipboard.on(callbackName, callbacks[callbackName]);
  }

  clipboard.on('load', function(client) {
    clipboard.on('dataRequested', function(client, args) {
      client.setText(clipboardContent);
    });
  });

  clipboard.on('noflash', function(client, args) {
    provideErrorMessageOnClipboardCopyAttempt(
      'You must have Flash Player installed to copy to the clipboard.'
    );
  });

  clipboard.on('wrongflash', function(client, args) {
    provideErrorMessageOnClipboardCopyAttempt(
      'You must upgrade your Flash Player to copy to the clipboard.'
    );
  });
}

util.inherits(ClipboardButton, Button);

module.exports = ClipboardButton;
