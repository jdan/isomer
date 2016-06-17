class Canvas {
  constructor(elem) {
    this.elem = elem;
    this.ctx = this.elem.getContext('2d');
    this.width = elem.width;
    this.height = elem.height;
  }
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }
  path(points, color) {
    this.ctx.beginPath()
    this.ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y)

    }
    this.ctx.closePath();
    this.ctx.save();
    this.ctx.globalAlpha = color.a;
    this.ctx.fillStyle = this.ctx.strokeStyle = color.toHex();
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.restore();
  }
}

module.exports.Canvas = Canvas;