(function() {
  /* By making this a function rather than an inline string, we allow minification of this code. */
  var makeAbsoluteUrlFromRelative = function(relativeUrl) {
    var a = document.createElement('a');
    a.href = relativeUrl;
    return a.href;
  };

  var makeSchemeRelativeUrlFromAbsolute = function(absoluteUrl) {
    return absoluteUrl.replace(/^https?:/, '');
  };

  var bookmarkletCode = function(codeURL) {
    var scriptElement = document.createElement('script');
    scriptElement.setAttribute('src', codeURL);
    scriptElement.setAttribute('crossorigin', 'anonymous');
    document.body.appendChild(scriptElement);
  };

  var codeURL = DEBUG
    ? makeSchemeRelativeUrlFromAbsolute(
        makeAbsoluteUrlFromRelative('bookcision.debug.js')
      )
    : makeSchemeRelativeUrlFromAbsolute(
        makeAbsoluteUrlFromRelative('bookcision.js')
      );
  var a = document.querySelector('a#bookmarklet');
  /*jshint scripturl:true*/
  a.href =
    'javascript:(' + bookmarkletCode.toString() + "('" + codeURL + "'));";
})();
