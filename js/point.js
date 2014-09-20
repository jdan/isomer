/**
 * Represents either a 2D or 3D point
 */
function Point(x, y, z) {
  if (this instanceof Point) {
    this.x = x;
    this.y = y;
    this.z = z;
  } else {
    return new Point(x, y, z);
  }
}

Point.ORIGIN = new Point(0, 0, 0);

module.exports = Point;
