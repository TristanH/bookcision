module.exports = function LimitedLengthQueue(maxLength) {
  var items = [];
  var onAddCallbacks = []; // @TODO pubsub instead?

  this.unshift = function(item) {
    items.unshift(item);

    onAddCallbacks.forEach(function(callback) {
      callback(items);
    });

    return items.length > maxLength ? items.pop() : null;
  };

  this.empty = function() {
    items.length = 0;
  };

  this.onItemAdded = function(callback) {
    onAddCallbacks.push(callback);
  };
};
