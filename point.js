(function (exports) {

  function Point(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }


  Point.ORIGIN = new Point(0, 0, 0);


  /**
   * Translate a point from a given dx, dy, and dz
   */
  Point.prototype.translate = function (dx, dy, dz) {
    return new Point(
      this.x + dx,
      this.y + dy,
      this.z + dz);
  };


  /**
   * Scale a point about a given origin
   */
  Point.prototype.scale = function (origin, dx, dy, dz) {
    var p = this.translate(-origin.x, -origin.y, -origin.z);

    if (dy === undefined && dz === undefined) {
      /* If both dy and dz are left out, scale all coordinates equally */
      dy = dz = dx;
      /* If just dz is missing, set it equal to 1 */
    } else {
      dz = (dz || 1);
    }

    p.x *= dx;
    p.y *= dy;
    p.z *= dz;

    return p.translate(origin.x, origin.y, origin.z);
  };


  /**
   * Rotate about origin on the Z axis
   */
  Point.prototype.rotateZ = function (origin, angle) {
    var p = this.translate(-origin.x, -origin.y, -origin.z);

    var x = p.x * Math.cos(angle) - p.y * Math.sin(angle);
    var y = p.x * Math.sin(angle) + p.y * Math.cos(angle);
    p.x = x;
    p.y = y;

    return p.translate(origin.x, origin.y, origin.z);
  };


  /**
   * Distance between two points
   */
  Point.distance = function (p1, p2) {
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    var dz = p2.z - p1.z;

    return Math.sqrt(dx*dx + dy*dy + dz*dz);
  };


  exports.Point = Point;

})(Isomer);
