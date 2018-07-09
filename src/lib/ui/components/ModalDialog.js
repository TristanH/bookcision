// ModalDialog - Creates a generic modal dialog on the page and allows the caller to fill in the content

var css = require('lib/ui/css');
var dom = require('lib/browser/dom');
var move = require('vendor/move');
var key = require('key');

require('lib/stylesheets/ModalDialog.less');

var currentModalDialog = null;

module.exports = function(nodeOrHtml) {
  if (currentModalDialog !== null)
    throw new Error('Can only create one modal dialog at a time.');

  currentModalDialog = this;
  var moveDuration = '0.15s'; // @TODO Move
  var containerElement = null;
  var fixedWrapper = null;

  var addToDOM = function() {
    document.body.appendChild(fixedWrapper);
  };

  var removeFromDOM = function() {
    document.body.removeChild(fixedWrapper);
    fixedWrapper = null;
    containerElement = null;

    currentModalDialog = null; // Allow creating another modal dialog now that this one is gone.
  };

  var createElementsAndAddToDOM = function() {
    fixedWrapper = document.createElement('div');
    css(fixedWrapper)
      .addClass('bootstrap')
      .addClass('bookcision-ModalDialog-fixedWrapper');

    containerElement = document.createElement('div');
    css(containerElement).addClass('bookcision-ModalDialog-containerElement');

    fixedWrapper.appendChild(containerElement);

    var closeButton = document.createElement('span');
    css(closeButton).addClass('bookcision-ModalDialog-closeButton');
    closeButton.innerHTML = '&times;'; // @Move to CSS?

    containerElement.appendChild(closeButton);

    // if the user clicks outside of the container element or clicks the close button, hide it
    fixedWrapper.addEventListener('click', function(clickEvent) {
      if (
        fixedWrapper === clickEvent.target ||
        closeButton.contains(clickEvent.target)
      )
        hideModalDialog();
    });

    addToDOM();

    // Make sure text never runs into close button (have to do after adding to
    // DOM so that closeButton.offsetWidth has a value)
    var totalCloseButtonWidthWithPaddingAndMargin =
      css(closeButton).getUsedValue('marginRight') + closeButton.offsetWidth;
    css(containerElement).apply(
      'padding-right',
      totalCloseButtonWidthWithPaddingAndMargin
    );

    showModalDialog();
  };

  var hideModalDialog = function() {
    window.removeEventListener('keyup', hideModalDialogIfEscapePressed);

    var resetPositionAndHide = function() {
      if (!fixedWrapper) return; // fixedWrapper can be removed from DOM before move.js callback

      // Hide the element and then instantly reset the opacity
      fixedWrapper.style.display = 'none';
      fixedWrapper.style.opacity = '1';
      removeFromDOM();
    };

    // Fade-out animation
    move(fixedWrapper)
      .set('opacity', '0')
      .duration(moveDuration)
      .then(resetPositionAndHide)
      .end();
  };

  var showModalDialog = function() {
    window.addEventListener('keyup', hideModalDialogIfEscapePressed);

    fixedWrapper.style.display = 'inline-block';
    fixedWrapper.style.opacity = '0';

    // Force browser to calculate styles on new DOM element listItem so that CSS3 transition below
    // can be applied (see http://stackoverflow.com/questions/3969817/css3-transitions-to-dynamically-created-elements)
    css(fixedWrapper).getUsedValue('opacity');

    // Fade-in animation
    move(fixedWrapper).set('opacity', '1').duration(moveDuration).end();
  };

  var hideModalDialogIfEscapePressed = function(evt) {
    if (key.is(key.code.special.esc, evt.which)) {
      hideModalDialog();
    }
  };

  this.appendChild = function(node) {
    containerElement.appendChild(node);
  };

  this.appendHTML = function(html) {
    containerElement.insertAdjacentHTML('beforeend', html);
  };

  createElementsAndAddToDOM();

  if (typeof nodeOrHtml !== 'undefined') {
    if (dom.isNode(nodeOrHtml)) {
      this.appendChild(nodeOrHtml);
    } else if (typeof nodeOrHtml === 'string') {
      this.appendHTML(nodeOrHtml);
    } else {
      throw 'Error: Cannot add object of unknown type to ModalDialog.';
    }
  }
};
