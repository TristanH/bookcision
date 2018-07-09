// Manages access to application storage in localStorage, stored by
// serializing/deserializing between a JSON string and an {}
//
//   var applicationStorage = getApplicationStorage("MyApplication");
//
//   applicationStorage.set("hat", "cat");
//   applicationStorage.set("face", 3);
//
//   var name = applicationStorage.get("hat");
//
//   applicationStorage.use(function(storage) {
//     storage.face++;
//     storage.hat = "cat2";
//     // Saves back storage after use...
//   });
//
//   Result:
//       localStorage["MyApplication.applicationStorage"] = {
//         hat: "cat2",
//         face: 4
//       }
//
//     and
//
//       name = "cat"

// @TODO In retrospect, this code doesn't make any sense...

var applicationUniqueKeyToInstancesMap = {};
module.exports = function(applicationUniqueKey) {
  // Always return the same instance for the same applicationUniqueKey
  if (!applicationUniqueKeyToInstancesMap.hasOwnProperty(applicationUniqueKey))
    applicationUniqueKeyToInstancesMap[
      applicationUniqueKey
    ] = new ApplicationStorage(applicationUniqueKey);

  return applicationUniqueKeyToInstancesMap[applicationUniqueKey];
};

var ApplicationStorage = function(applicationUniqueKey) {
  var localStorageKey = applicationUniqueKey + '.applicationStorage';
  var applicationStorage = null;

  var saveToLocalStorage = function() {
    var applicationStorageAsJSON = JSON.stringify(applicationStorage);
    localStorage.setItem(localStorageKey, applicationStorageAsJSON);
  };

  var initializeFromLocalStorage = function() {
    var applicationStorageAsJSON = localStorage.getItem(localStorageKey);
    if (applicationStorageAsJSON)
      applicationStorage = JSON.parse(applicationStorageAsJSON);

    if (applicationStorage === null) applicationStorage = {};
  };

  var getApplicationStorage = function() {
    if (applicationStorage === null) initializeFromLocalStorage();

    return applicationStorage;
  };

  this.get = function(property) {
    return getApplicationStorage()[property];
  };

  this.set = function(property, value) {
    getApplicationStorage()[property] = value;
    saveToLocalStorage();
  };

  this.use = function(user) {
    user(getApplicationStorage());
    saveToLocalStorage();
  };

  this._getGetLocalStorageKey = function() {
    return localStorageKey;
  };
};
