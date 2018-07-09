var css = require('lib/ui/css');
var dom = require('lib/browser/dom');

// Requires an element with the following HTML structure be passed in:
//    button.btn
//      [i.icon-ok]
//      |  Button Text
function Button(element) {
  // // @TODO Support passing in the parent div of the button for button groups?
  // if (element.nodeName === "div" && element.firstChild.nodeName === "button")
  //   element = element.firstChild;

  this._element = element;
  if (!dom.isElement(this._element))
    throw new Error('Argument is not an HTMLElement.');

  this._icon = this._element.querySelector('i');

  this._textElement = this._element.lastChild;
  if (!dom.isTextNode(this._textElement))
    throw new Error('The last element in the button must be a text node.');

  this._runningFlashAnimations = false;
}

Button.prototype.setText = function(newText) {
  if (this._textElement !== this._element.lastChild)
    throw new Error('Unexpected DOM structure in button.');

  var newTextNode = document.createTextNode(newText);
  this._element.replaceChild(newTextNode, this._textElement);
  this._textElement = this._element.lastChild;
};

Button.prototype.getText = function() {
  return this._textElement.nodeValue;
};

Button.prototype.setIcon = function(className) {
  this._icon.className = className;
};

Button.prototype.getIcon = function() {
  return this._icon.className;
};

Button.prototype.flash = function(options) {
  if (options.icon && !dom.isElement(this._icon))
    throw new Error(
      'Invalid option for this button, which does not contain an icon.'
    );

  if (!this._runningFlashAnimations) {
    this._runningFlashAnimations = true;

    var originalIconClass = this.getIcon();
    var originalText = this.getText();

    var switchToTemporaryIconAndText = function() {
      // Swap out icon and text WITHOUT css transition
      if (options.icon) {
        this.setIcon(options.icon);
      }

      if (options.text) {
        var newText = originalText[0] === ' '
          ? ' ' + options.text
          : options.text;
        this.setText(newText);
      }
    }.bind(this);

    var switchBackToOriginalIcon = function(onCompleteCallback) {
      // Then swap back in the original copy icon and text
      this.setIcon(originalIconClass);
      this.setText(originalText);

      // And fade in the original icon with css transition
      css(this._icon).fadeIn(100, onCompleteCallback);
    }.bind(this);

    var resetRunningFlashAnimations = function() {
      this._runningFlashAnimations = false;
    }.bind(this);

    var switchBackToOriginalIconAndReset = function() {
      // Fade out with css transition then do the switch
      css(this._icon).fadeOut(100, function() {
        switchBackToOriginalIcon(resetRunningFlashAnimations);
      });
    }.bind(this);

    switchToTemporaryIconAndText();
    setTimeout(switchBackToOriginalIconAndReset, 3000);
  }
};

module.exports = Button;
