function Isometric(canvas) {
  this.canvas = canvas;

  // Send these in too
  this.scaleX = 70;
  this.scaleY = 70;
  this.scaleZ = 50;

  this.originX = this.canvas.width / 2;
  this.originY = this.canvas.height * 0.9;

  this.angle = Math.PI / 7;

  /**
   * Light source as defined as the angle from
   * the object to the source.
   *
   * We'll define somewhat arbitrarily for now.
   */
  this.lightAngle = new Vector(2, -1, 3).normalize();
}

Isometric.prototype._translatePoint = function (point) {
  /**
   * X rides along the angle extended from the origin
   * Y rides perpendicular to this angle (in isometric view: PI - angle)
   * Z affects the y coordinate of the drawn point
   */
  var xMap = new Point(point.x * this.scaleX * Math.cos(this.angle),
                       point.x * this.scaleX * Math.sin(this.angle));

  var yMap = new Point(point.y * this.scaleY * Math.cos(Math.PI - this.angle),
                       point.y * this.scaleY * Math.sin(Math.PI - this.angle));

  var x = this.originX + xMap.x + yMap.x;
  var y = this.originY - xMap.y - yMap.y - (point.z * this.scaleZ);
  return new Point(x, y);
};

Isometric.prototype.path = function (points, baseColor) {
  /* Compute color */
  var v1 = Vector.fromTwoPoints(points[1], points[0]);
  var v2 = Vector.fromTwoPoints(points[2], points[1]);

  var normal = Vector.crossProduct(v1, v2).normalize();

  /**
   * Brightness is between -1 and 1 and is computed based
   * on the dot product between the light source vector and normal.
   */
  var brightness = Vector.dotProduct(normal, this.lightAngle);

  /* We'll inject brightness into this for now */
  /* 50 - 180 */
  var colorComponent = (brightness / 2 + 1) * 130 + 50;
  var color = new Color(colorComponent, colorComponent, colorComponent);

  this.canvas.path(points.map(this._translatePoint.bind(this)), color);
};

/* Flat square */
Isometric.prototype.square = function (origin, width, height, z) {
  z = z || 0;

  this.path([
    new Point(origin.x, origin.y, z),
    new Point(origin.x + width, origin.y, z),
    new Point(origin.x + width, origin.y + height, z),
    new Point(origin.x, origin.y + height, z)
  ], true);
};

Isometric.prototype.prism = function (origin, dx, dy, dz) {
  /* We only need to draw the front 3 squares */

  /* Square parallel to the x-axis */
  this.path([
    origin,
    new Point(origin.x + dx, origin.y, origin.z),
    new Point(origin.x + dx, origin.y, origin.z + dz),
    new Point(origin.x, origin.y, origin.z + dz)
  ], true);

  /* Square parallel to the y-axis */
  this.path([
    origin,
    new Point(origin.x, origin.y, origin.z + dz),
    new Point(origin.x, origin.y + dy, origin.z + dz),
    new Point(origin.x, origin.y + dy, origin.z)
  ], true);

  /* Square parallel to the xy-plane */
  this.square(origin, dx, dy, origin.z + dz);
};

Isometric.prototype.pyramid = function (origin, dx, dy, dz) {
  /* We only need to draw the two visible faces */

  /* Path parallel to the x-axis */
  this.path([
    origin,
    new Point(origin.x + dx, origin.y, origin.z),
    new Point(origin.x + dx / 2, origin.y + dy / 2, origin.z + dz)
  ], true);

  /* Path parallel to the y-axis */
  this.path([
    origin,
    new Point(origin.x + dx / 2, origin.y + dy / 2, origin.z + dz),
    new Point(origin.x, origin.y + dy, origin.z)
  ], true);
};

