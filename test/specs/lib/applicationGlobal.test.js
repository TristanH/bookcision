describe('applicationGlobal', function() {
  var applicationGlobal = require('lib/applicationGlobal');

  it('returns an empty object on first time use', function() {
    applicationGlobal.should.be.empty;
  });

  it('allows testing for a non-existent property', function() {
    applicationGlobal.should.not.have.property('someProperty');
  });

  it('allows setting a property', function() {
    applicationGlobal.someProperty = true;
    applicationGlobal.someProperty.should.be.true;
  });

  it('returns the properties set globally on subsequent use', function() {
    var otherApplicationGlobal = require('lib/applicationGlobal');
    applicationGlobal.should.not.have.property('somePropertyThatWasNeverSet');
    otherApplicationGlobal.someProperty.should.be.true;
  });
});
