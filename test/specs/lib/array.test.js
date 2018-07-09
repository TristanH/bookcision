describe('array', function() {
  var array = require('lib/array');

  describe('.unique()', function() {
    it('should return an array with only unique elements', function() {
      array.unique([]).should.eql([]);
      array.unique([1, 2, 3, 3]).should.eql([1, 2, 3]);
      array.unique([1, 2, 3, 1]).should.eql([1, 2, 3]);
      array.unique([1, 2, 3, 1, 2]).should.eql([1, 2, 3]);
      array.unique([2, 3, 1, 3, 2]).should.eql([2, 3, 1]);
      array.unique([1, 2, 2, 3, 3]).should.eql([1, 2, 3]);
    });
  });

  describe('.last()', function() {
    it('should return the last element', function() {
      should.strictEqual(undefined, array.last([]));
      array.last([1]).should.equal(1);
      array.last([1, 2, 3, 3]).should.equal(3);
      array.last([1, 2, 3, 1]).should.equal(1);
      array.last([1, 2, 3, 1, 2]).should.equal(2);
      array.last([2, 3, 1, 3, 2]).should.equal(2);
      array.last([1, 2, 2, 3, 3]).should.equal(3);
      array.last([1, 2, ';asdf', 3, 3]).should.equal(3);
    });
  });
});
