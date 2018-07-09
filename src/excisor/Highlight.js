var mapSourceObjectOntoSinkObject = require('lib/mapSourceObjectOntoSinkObject');

var Highlight = function(data) {
  mapSourceObjectOntoSinkObject(data, this);
};

Highlight.isEqual = function(a, b) {
  var allFields = Highlight.schema.requiredFields.concat(
    Highlight.schema.optionalFields
  );
  return allFields.every(function(field) {
    return a[field] === b[field];
  });
};

Highlight.schema = {
  requiredFields: ['text', 'isNoteOnly', 'location.url', 'location.value'],
  optionalFields: ['note']
};

module.exports = Highlight;
