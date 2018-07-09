// feedback - Console-like UI to show feedback to the user about progress and what is
// happening with the bookmarklet during the loading/parsing/initialization phase

// @TODO Fix progress bars.

var css = require('lib/ui/css'); // @TODO Do we still need this module in this file? In the project?
var LimitedLengthQueue = require('lib/LimitedLengthQueue');
var move = require('vendor/move');

require('lib/stylesheets/bootstrap.less');
require('lib/stylesheets/feedback.less');

// @TODO Hook up to UI events.
// @TODO Leave the UI up on the screen while the user is moused over.
// @TODO Make re-use existing DOM elements if they already exist on page (e.g. after reloading bookmarklet js).

module.exports = (function() {
  var moveDuration = '0.15s'; // @TODO Move this to move.defaults = { duration: X } once move is scoped to just this code
  var secondsBeforeHidingUI = 2;

  var fixedWrapper = null;
  var containerElement = null;
  var messagesContainerElement = null;
  var maxMessagesToDisplay = 3;
  var messagesForUser = new LimitedLengthQueue(maxMessagesToDisplay);

  var progressBar = null;
  var progressBarContainer = null;
  var progressBarPercent = null;

  var addToDOM = function() {
    document.body.appendChild(fixedWrapper);
  };

  var removeFromDOM = function() {
    document.body.removeChild(fixedWrapper);
    fixedWrapper = null;
    containerElement = null;
  };

  var createElementsIfNecessary = function() {
    // Create the container if necessary
    if (!fixedWrapper) {
      fixedWrapper = document.createElement('div');
      css(fixedWrapper)
        .addClass('bootstrap')
        .addClass('bookcision-feedback-fixedWrapper');

      containerElement = document.createElement('div');
      css(containerElement).addClass('bookcision-feedback-containerElement');

      progressBarContainer = document.createElement('div');
      css(progressBarContainer)
        .addClass('progress')
        .addClass('progress-dull')
        .addClass('progress-striped');
      progressBar = document.createElement('div');
      css(progressBar).addClass('bar');
      progressBarContainer.appendChild(progressBar);
      containerElement.appendChild(progressBarContainer);
      hideProgressBar();

      messagesContainerElement = document.createElement('ul');
      css(messagesContainerElement).addClass(
        'bookcision-feedback-messagesContainerElement'
      );
      containerElement.appendChild(messagesContainerElement);

      fixedWrapper.appendChild(containerElement);

      // if the user clicks outside of the container element, hide it
      fixedWrapper.addEventListener('click', function(clickEvent) {
        if (!containerElement.contains(clickEvent.target))
          hideContainerElement();
      });

      addToDOM();
    }

    showContainerElement();
  };

  var hideContainerElement = function() {
    clearFeedbackTimeoutCheck();

    var resetPositionAndHide = function() {
      if (!containerElement) return; // containerElement can be removed from DOM before move.js callback

      // Hide the element and then instantly move it back to the original position
      containerElement.style.display = 'none';
      move(containerElement).y(0).duration('0s').end();

      removeFromDOM();

      removeAllMessages();
    };

    // Slide-up animation
    move(containerElement)
      .y(containerElement.offsetHeight * -1)
      .duration(moveDuration)
      .then(resetPositionAndHide)
      .end();
  };

  var showContainerElement = function() {
    containerElement.style.display = 'inline-block';
  };

  var removeAllMessages = function() {
    while (messagesContainerElement.hasChildNodes())
      messagesContainerElement.removeChild(messagesContainerElement.lastChild);

    messagesForUser.empty(); // @TODO Keeping the DOM and this queue in sync is currently all manual. Fix.
  };

  var hideProgressBar = function() {
    progressBarPercent = null;
    progressBarContainer.style.display = 'none';
  };
  var showProgressBar = function(percent) {
    if (percent < 0 || percent > 100)
      throw new Error(
        'Progress bar width must be between 0 and 100, inclusive'
      );

    progressBarPercent = percent;
    progressBar.style.width = String(progressBarPercent) + '%';

    if (progressBarPercent < 100) css(progressBarContainer).addClass('active');
    else css(progressBarContainer).removeClass('active');

    progressBarContainer.style.display = '';
  };

  var timeoutID = null;
  var clearFeedbackTimeoutCheck = function() {
    if (timeoutID) {
      clearTimeout(timeoutID);
      timeoutID = null;
    }
  };
  var setupFeedbackTimeoutCheck = function() {
    clearFeedbackTimeoutCheck();

    if (progressBarPercent === null || progressBarPercent === 100) {
      timeoutID = setTimeout(
        hideContainerElement,
        secondsBeforeHidingUI * 1000
      );
    }
  };

  var addText = function(text, displayProgressBarPercent) {
    if (displayProgressBarPercent) {
      showProgressBar(displayProgressBarPercent);
    } else {
      hideProgressBar();
    }

    var listItem = document.createElement('li');
    listItem.style.fontSize = '0.4em'; // @TODO Re-evaluate all em values after understanding em better
    listItem.style.opacity = '0';

    var messageToRemove = messagesForUser.unshift(listItem);
    if (messageToRemove) {
      // Fade out the last element and then remove it from the DOM
      move(messageToRemove)
        .set('font-size', '0em')
        .set('opacity', '0')
        .duration(moveDuration)
        .end(function() {
          if (messagesContainerElement.contains(messageToRemove))
            messagesContainerElement.removeChild(messageToRemove);
        });
    }

    // Add the text as a text node
    var textNode = document.createTextNode(text);
    listItem.appendChild(textNode);

    // Insert the list item into the DOM
    listItem.style.margin = 0;
    messagesContainerElement.insertBefore(
      listItem,
      messagesContainerElement.firstElementChild
    );

    // Force browser to calculate styles on new DOM element listItem so that CSS3 transition below
    // can be applied (see http://stackoverflow.com/questions/3969817/css3-transitions-to-dynamically-created-elements)
    css(listItem).getUsedValue('opacity');

    // Set all the styles
    var children = Array.prototype.slice.call(
      messagesContainerElement.children
    );
    children.forEach(function(child, index) {
      switch (index) {
        case 0:
          move(child)
            .set('font-size', '2.5em')
            .set('opacity', '1')
            .duration(moveDuration)
            .end();
          break;
        case 1:
          move(child)
            .set('font-size', '1.5em')
            .set('color', 'rgba(255, 255, 255, .5)')
            .duration(moveDuration)
            .end();
          break;
        case 2:
          move(child)
            .set('font-size', '1.0em')
            .set('color', 'rgba(255, 255, 255, .3)')
            .duration(moveDuration)
            .end();
          break;
      }
    });
  };

  return function() {
    if (!document.body) {
      throw 'Error: DOM is not loaded yet.';
    }

    createElementsIfNecessary();
    addText.apply(this, arguments);
    setupFeedbackTimeoutCheck(); // @TODO convert this to be a callback on changing the message queue and
    // changing the progress bar percent.
  };
})();
