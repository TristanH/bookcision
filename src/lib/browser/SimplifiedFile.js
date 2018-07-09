var saveAs = require('vendor/FileSaver');

module.exports = function(filename, mimetype, content) {
  var self = this;
  var fileEntry = null;
  var blob = new Blob([content], { type: mimetype });

  this.download = function() {
    var f = saveAs(blob, filename);
  };
};
