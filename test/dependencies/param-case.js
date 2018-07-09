// Make sure that webpack can pack this module (it has caused trouble in the past)
// var changeCase = require("change-case");
describe('dependencies/param-case', function() {
  var paramCase = require('param-case');

  it('should convert to param case', function() {
    paramCase('maxWidth').should.eql('max-width');

    // Copied from the module itself
    assert.equal(paramCase('testString'), 'test-string');
    assert.equal(paramCase('Test String'), 'test-string');
    assert.equal(paramCase('Test_String'), 'test-string');
    assert.equal(paramCase('Test-String'), 'test-string');
    assert.equal(paramCase('a---better__test'), 'a-better-test');
  });
});
