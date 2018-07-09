// @TODO Factor out
var path = require('path');
var functional = require('lib/functional');

describe('functional', function() {
  describe('.memoize()', function() {
    it('calls the original function', function() {
      var callback = sinon.spy();
      var memoizedCallback = functional.memoize(callback);

      memoizedCallback();

      assert(callback.called);
    });

    it('calls the original function only once', function() {
      var callback = sinon.spy();
      var proxy = functional.memoize(callback);

      proxy();
      proxy();

      assert(callback.calledOnce);
    });

    it('returns the same value', function() {
      var callback = (function() {
        var monotonicNumber = 0;
        return function() {
          return ++monotonicNumber;
        };
      })();

      callback = sinon.spy(callback);

      var proxy = functional.memoize(callback);

      proxy();
      proxy();

      assert(callback.alwaysReturned(1));
    });

    it('calls original function with right this and args', function() {
      var callback = sinon.spy();
      var proxy = functional.memoize(callback);
      var obj = {};

      proxy.call(obj, 1, 2, 3);

      assert(callback.calledOn(obj));
      assert(callback.calledWith(1, 2, 3));
    });
  });
});
