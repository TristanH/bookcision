var array = require('lib/array'),
  string = require('lib/string'),
  dom = require('lib/browser/dom'),
  functional = require('lib/functional');

module.exports = (function() {
  var extractASIN = function() {
    var asin = null;

    // First try: window.workData is currently prepopulated with all the data we need.
    if (
      typeof workData !== 'undefined' &&
      workData !== null &&
      workData.asin &&
      workData.asin.trim().length > 0
    ) {
      asin = workData.asin.trim();
    } else {
      var candidates = [
        dom.extractStringFromElement('input[name=asin]'),
        dom.extractStringFromElement('input#kp-notebook-annotations-asin'),
      ];

      asin = candidates.find(Boolean);
    }

    if (!asin && localStorage && localStorage.getItem('last_app_activity')) {
      // Second try: check known DOM element that contains the string
      // read.amazon.com (Cloud Reader)
      try {
        var lastAppActivity = JSON.parse(
          localStorage.getItem('last_app_activity')
        );
        asin = lastAppActivity.asin;
      } catch (e) {}
    }

    return asin;
  };

  // {name: XYZ, profileUrl: <URL>}
  var extractUser = function() {
    var user = null;

    if (
      typeof viewerData !== 'undefined' &&
      viewerData !== null &&
      viewerData.customerId &&
      viewerData.customerId.length > 0
    ) {
      user = {
        id: viewerData.customerId,
      };
    }

    return user;
  };

  var extractAmazonDeviceType = function() {
    var deviceType =
      typeof window !== 'undefined' && window.KindleGlobal
        ? window.KindleGlobal.amazonDeviceType
        : null;
    if (!deviceType) {
      deviceType = 'A2CLFWBIMVSE9N';
    }

    return deviceType;
  };

  return {
    findASIN: extractASIN,
    findUser: functional.memoize(extractUser),
    getAmazonDeviceType: functional.memoize(extractAmazonDeviceType),
  };
})();
