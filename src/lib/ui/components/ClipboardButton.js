var util = require('util'),
  Button = require('lib/ui/components/Button');

function ClipboardButton(element, clipboardContent, callbacks) {
  Button.call(this, element);

  var buttonElement = this._element;
  callbacks = callbacks || {};

  buttonElement.addEventListener('click', function() {
    // Use modern Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(clipboardContent)
        .then(function() {
          if (callbacks.complete) {
            callbacks.complete();
          }
        })
        .catch(function(err) {
          console.error('Failed to copy to clipboard:', err);
          alert('Failed to copy to clipboard. Please try selecting the text manually.');
        });
    } else {
      // Fallback for older browsers - use execCommand
      var textArea = document.createElement('textarea');
      textArea.value = clipboardContent;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        if (callbacks.complete) {
          callbacks.complete();
        }
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        alert('Failed to copy to clipboard. Please try selecting the text manually.');
      }
      document.body.removeChild(textArea);
    }
  });
}

util.inherits(ClipboardButton, Button);

module.exports = ClipboardButton;
