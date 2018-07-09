// Only works on string arrays since it uses an object as a hash to check for uniqueness
exports.unique = function(stringArray) {
  var hash = {},
    result = [];
  for (var i = 0; i < stringArray.length; ++i) {
    if (!hash.hasOwnProperty(stringArray[i])) {
      hash[stringArray[i]] = true;
      result.push(stringArray[i]);
    }
  }
  return result;
};

exports.last = function(array) {
  return array[array.length - 1];
};

// Array Remove - By John Resig (MIT Licensed)
//
// Remove the second item from the array
//   array.remove(1);
// Remove the second-to-last item from the array
//   array.remove(-2);
// Remove the second and third items from the array
//   array.remove(1,2);
// Remove the last and second-to-last items from the array
//   array.remove(-2,-1);
//
exports.removeByRange = function(array, from, to) {
  var rest = array.slice((to || from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;
  return array.push.apply(array, rest);
};

// http://stackoverflow.com/a/3955096
exports.removeByValue = function(array) {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L && array.length) {
    what = a[--L];
    while ((ax = array.indexOf(what)) !== -1) {
      array.splice(ax, 1);
    }
  }
  return array;
};

exports.clone = function(array) {
  return array.slice(0);
};
