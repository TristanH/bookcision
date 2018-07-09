// Needed by CSSselect
if (!String.prototype.trimLeft) {
  String.prototype.trimLeft = function() {
    return this.replace(/^\s+/, '');
  };
}
