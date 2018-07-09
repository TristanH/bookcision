// @TODO every module export should have a function that returns browser compatibility
// so that these can be run elsewhere and action can be taken accordingly if the browser
// is not compatible. E.g. this module relies on localStorage.

// @TODO Hook this up?

var versionManager = function(applicationUniqueKey, currentVersion) {
  var applicationStorage = new ApplicationStorage(applicationUniqueKey);
  var data = (localStorage[moduleName] = {});
};
