var getApplicationStorage = require('lib/browser/applicationStorage');

// Initialize a global localStorage shim to allow the applicationStorage code to work.
var Storage = require('dom-storage');
global.localStorage = new Storage(null);

describe('applicationStorage', function() {
  describe('localStorage shim', function() {
    it('should have get/set methods that work', function() {
      global.localStorage.setItem('face', 'hat');
      global.localStorage.getItem('face').should.equal('hat');
    });
  });

  describe('#getApplicationStorage()', function() {
    it('should return the same ApplicationStorage instance for calls with the same argument', function() {
      var applicationStorage = getApplicationStorage('bookcision');
      var applicationStorage2 = getApplicationStorage('bookcision');
      assert.equal(applicationStorage, applicationStorage2);
    });
  });

  describe('#set()', function() {
    it('should set the given property and value in localStorage', function() {
      var applicationStorage = getApplicationStorage('TestApplication');
      applicationStorage.set('hat', 'cat');

      var localStorageKey = applicationStorage._getGetLocalStorageKey();
      var applicationStorageFromLocalStorageJSON = global.localStorage.getItem(
        localStorageKey
      );
      var applicationStorageFromLocalStorage = JSON.parse(
        applicationStorageFromLocalStorageJSON
      );
      applicationStorageFromLocalStorage.hat.should.equal('cat');
    });
  });
});
