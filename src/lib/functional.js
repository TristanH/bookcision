// Functional programming helpers.

// Only allows fn to be run once. On all subsequent runs, returns the same
// value as the first time. Passes through function arguments but does not
// re-run the function when different arguments are passed in.
exports.memoize = function(fn) {
  var hasRun = false;
  var returnValue = null;
  return function() {
    if (!hasRun) {
      hasRun = true;
      returnValue = fn.apply(this, arguments);
    }

    return returnValue;
  };
};
