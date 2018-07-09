exports.startsWith = function(str, substr) {
  return str.indexOf(substr) === 0;
};

exports.isWhitespace = function(str) {
  return /^\s*$/.test(str);
};

exports.isNotEmpty = function(str) {
  return Boolean(str && !exports.isWhitespace(str));
};
