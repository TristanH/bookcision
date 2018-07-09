// @TODO Move to lib
// @TODO Rewrite this comment
//
// Takes a jade template (or any function that takes a context and returns
// HTML) to the rest of the
// application via getFragment() export. getFragment() takes an instance of an
// object that has an associated template and returns a DocumentFragment.
//
// For each jade template we pull in the CSS as well as a JS file describing
// what events should be attached to the DOM elements declared in the jade
// template.  For example for a Book instance, we would pull in the files:
//
//     * excisor/templates/book.jade
//     * excisor/templates/book.jade.js
//     * excisor/stylesheets/book.less

var dom = require('lib/browser/dom');

module.exports = function(template, templateJS) {
  var processTemplateJS = function(object, fragment) {
    if (templateJS.events) {
      var attachHandler = function(element, eventHandlerDefinition) {
        element.addEventListener(eventHandlerDefinition.event, function() {
          var args = Array.prototype.slice.call(arguments, 0);
          args.unshift(object);
          eventHandlerDefinition.handler.apply(this, args);
        });
      };

      templateJS.events.forEach(function(eventHandlerDefinition) {
        var elements = [];

        if (eventHandlerDefinition.element)
          elements.push(eventHandlerDefinition.element);

        if (eventHandlerDefinition.elements)
          Array.prototype.push.apply(elements, eventHandlerDefinition.elements);

        if (eventHandlerDefinition.selector)
          Array.prototype.push.apply(
            elements,
            fragment.querySelectorAll(eventHandlerDefinition.selector)
          );

        // We don't throw in the case of not being able to find the DOM element.
        // This is to allow templates to be flexible: if an element is
        // conditionally not added to the DOM, we just don't attach any event
        // handlers to it. No big thing.
        elements.forEach(function(element) {
          attachHandler(element, eventHandlerDefinition);
        });
      });
    }

    if (templateJS.onAfterFragmentGenerated) {
      templateJS.onAfterFragmentGenerated.call(fragment, object, fragment);
    }
  };

  return {
    getHtml: template,
    getFragment: function(object) {
      var html = template(object);
      var fragment = dom.createDocumentFragmentFromHtml(html);

      processTemplateJS(object, fragment);

      return fragment;
    }
  };
};
