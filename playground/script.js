function Scratchpad(editor, canvas) {
  this.editor = editor;
  this.canvas = canvas;
}

Scratchpad.prototype.resetCanvas = function () {
  var ctx = canvas.getContext('2d');
  var width = 2*canvas.width;
  var height = 2*canvas.height;

  ctx.clearRect(0, 0, width, height);
};

Scratchpad.prototype.eval = function () {
  eval(this.editor.getValue());
};

Scratchpad.prototype.run = function () {
  var self = this;
  var timeout;

  // Eval once at the beginning
  self.eval();

  this.editor.getSession().on('change', function (e) {
    // Prevent the editor from updating too much by only
    // doing actions after 200ms
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(function () {
      self.resetCanvas();
      self.eval();
    }, 200);
  });
};
