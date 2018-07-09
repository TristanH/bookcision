var objectPath = require('object-path');
var array = require('lib/array');

module.exports = function mapSourceObjectOntoSinkObject(source, sink) {
  var schema = sink.constructor.schema;
  var unmappedRequiredFields = array.clone(schema.requiredFields);

  var fields = schema.requiredFields.concat(schema.optionalFields);

  fields.forEach(function(key) {
    var value = objectPath.get(source, key);

    if (value !== undefined) {
      objectPath.set(sink, key, value);
      array.removeByValue(unmappedRequiredFields, key);
    } else if (key in schema.requiredFields) {
      throw new Error("Could not find required field '" + key + "' in object.");
    }
  });

  if (unmappedRequiredFields.length > 0)
    throw new Error(
      'The following required fields not found in the source object: ' +
        unmappedRequiredFields.join(', ')
    );
};
