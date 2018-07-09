var Highlight = require('excisor/Highlight');

var allTestData = require('test/data/data.js');
var data = allTestData.pinker;

describe('Highlight', function() {
  describe('#constructor', function() {
    it('defines all the properties a highlight needs', function() {
      var rawHighlight = data.highlights[0];
      var highlight = new Highlight(rawHighlight);

      highlight.should.have.property('text').eql(rawHighlight.text);
      highlight.should.have.property('location').eql(rawHighlight.location);
    });

    it('throws when no arguments are provided', function() {
      (function() {
        new Highlight();
      }.should.throw());
    });

    it('throws when no properties are provided', function() {
      (function() {
        new Highlight({});
      }.should.throw());
    });

    it('does not throw when properties are provided', function() {
      var rawHighlight = data.highlights[0];
      (function() {
        new Highlight(rawHighlight);
      }.should.not.throw());
    });
  });
});
