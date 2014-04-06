(function (exports) {

  function Canvas(elem) {
    this.elem = elem;
    this.ctx = this.elem.getContext('2d');

    this.width = elem.getAttribute('width');
    this.height = elem.getAttribute('height');
  }

  /**
   * Draws and fills a path based on points and color. An optional
   * baseColor can also be passed as the strokeStyle, but otherwise
   * `color` will be used for both.
   *
   * The separate baseColor is set to the color before lighting effects
   * are added to it, ensuring a consistent line color, which removes
   * some seams that may appear between blocks
   */
  Canvas.prototype.path = function (points, color, baseColor) {
    baseColor = baseColor || color;

    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);

    for (var i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }

    this.ctx.closePath();

    /* Set the strokeStyle and fillStyle */
    this.ctx.save();
    this.ctx.fillStyle = color.toHex();
    this.ctx.strokeStyle = baseColor.toHex();
    /* Stroke and fill to remove sub-pixel gaps */
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.restore();
  };

  exports.Canvas = Canvas;

})(Isomer);
