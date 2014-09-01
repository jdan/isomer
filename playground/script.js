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
  var code = this.editor.getValue();

  /**
   * https://github.com/jsbin/loop-protect/issues/5
   * The following sequence:
   *
   *   while (1)
   *
   *   console.log
   *
   * translates to:
   *
   *   while (1)
   *   console.log
   *
   * Which throws an infinite loop. Adding a semicolon to the end of the line
   * fixes it.
   *
   * Temporarily, add a semi-colon to the end of every line starting with
   * `while`, `for`, or `do`.
   */
  var safe = loopProtect(code.replace(/((while|for|do).+)/g, "$1;"));
  eval(safe);
};

Scratchpad.prototype.save = function () {
  if (localStorage) {
    localStorage.setItem('scratch', this.editor.getValue());
  }
};

Scratchpad.prototype.load = function () {
  if (localStorage && localStorage.getItem('scratch')) {
    this.editor.setValue(localStorage.getItem('scratch'));
  }
};

Scratchpad.prototype.run = function () {
  var self = this;
  var timeout;

  loopProtect.hit = function (line) {
    self.editor.session.setAnnotations([{
      row: line - 1,
      type: "error",
      text: "Infinite loop detected"
    }]);
  };

  // Eval once at the beginning
  this.eval();

  this.editor.getSession().on('change', function (e) {
    // Prevent the editor from updating too much by only
    // doing actions after 200ms
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(function () {
      self.resetCanvas();
      self.eval();
      self.save();
    }, 200);
  });
};
