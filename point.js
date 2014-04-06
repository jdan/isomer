(function (exports) {

  function Point(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z || 0;
  }

  Point.prototype.translate = function (dx, dy, dz) {
    return new Point(
      this.x + dx,
      this.y + dy,
      this.z + dz);
  };

  /**
   * Rotate about origin on the Z axis
   */
  Point.prototype.rotateZ = function (angle, origin) {
    origin = origin || new Point(0, 0, 0);

    var p = this.translate(-origin.x, -origin.y, -origin.z);

    var x = p.x * Math.cos(angle) - p.y * Math.sin(angle);
    var y = p.x * Math.sin(angle) + p.y * Math.cos(angle);
    p.x = x;
    p.y = y;

    return p.translate(origin.x, origin.y, origin.z);
  };

  exports.Point = Point;

})(Isomer);
