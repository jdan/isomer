/**
 * The Isomer class
 *
 * This file contains the Isomer base definition
 */

var Point, Path, Color, Vector, Canvas;

function Isomer(canvasId) {
  /**
   * Convenient renames
   */
  Point = Isomer.Point;
  Path = Isomer.Path;
  Color = Isomer.Color;
  Vector = Isomer.Vector;
  Canvas = Isomer.Canvas;

  this.canvas = new Canvas(canvasId);

  this.angle = Math.PI / 6;

  // send this in too
  this.scale = 70;

  this.originX = this.canvas.width / 2;
  this.originY = this.canvas.height * 0.9;


  /**
   * Light source as defined as the angle from
   * the object to the source.
   *
   * We'll define somewhat arbitrarily for now.
   */
  this.lightAngle = new Vector(2, -1, 3).normalize();

  /**
   * The maximum color difference from shading
   */
  this.colorDifference = 0.20;
}

Isomer.prototype._translatePoint = function (point) {
  /**
   * X rides along the angle extended from the origin
   * Y rides perpendicular to this angle (in isometric view: PI - angle)
   * Z affects the y coordinate of the drawn point
   */
  var xMap = new Point(point.x * this.scale * Math.cos(this.angle),
                       point.x * this.scale * Math.sin(this.angle));

  var yMap = new Point(point.y * this.scale * Math.cos(Math.PI - this.angle),
                       point.y * this.scale * Math.sin(Math.PI - this.angle));

  var x = this.originX + xMap.x + yMap.x;
  var y = this.originY - xMap.y - yMap.y - (point.z * this.scale);
  return new Point(x, y);
};


/**
 * Adds a shape or path to the scene
 */
Isomer.prototype.add = function (item, baseColor) {
  if (item instanceof Path) {
    this._addPath(item, baseColor);
  } else if (item instanceof Shape) {
    for (var i in item.paths) {
      this._addPath(item.paths[i], baseColor);
    }
  }
};


/**
 * Adds a path to the scene
 */
Isomer.prototype._addPath = function (path, baseColor) {
  /* Default baseColor */
  baseColor = baseColor || new Color(120, 120, 120);

  /* Compute color */
  var v1 = Vector.fromTwoPoints(path.points[1], path.points[0]);
  var v2 = Vector.fromTwoPoints(path.points[2], path.points[1]);

  var normal = Vector.crossProduct(v1, v2).normalize();

  /**
   * Brightness is between -1 and 1 and is computed based
   * on the dot product between the light source vector and normal.
   */
  var brightness = Vector.dotProduct(normal, this.lightAngle);

  /* We'll inject brightness into this for now */
  /* 50 - 180 */
  //var colorComponent = (brightness / 2 + 1) * 130 + 50;
  //var color = new Color(colorComponent, colorComponent, colorComponent);

  var color = baseColor.lighten(brightness * this.colorDifference);
  this.canvas.path(path.points.map(this._translatePoint.bind(this)), color, baseColor);
};

/* Flat square */
Isomer.prototype.square = function (origin, width, height, z) {
  z = z || 0;

  this.path([
    new Point(origin.x, origin.y, z),
    new Point(origin.x + width, origin.y, z),
    new Point(origin.x + width, origin.y + height, z),
    new Point(origin.x, origin.y + height, z)
  ], color);
};

Isomer.prototype.pyramid = function (origin, dx, dy, dz, color) {
  /* We only need to draw the two visible faces */

  /* Path parallel to the x-axis */
  this.path([
    origin,
    new Point(origin.x + dx, origin.y, origin.z),
    new Point(origin.x + dx / 2, origin.y + dy / 2, origin.z + dz)
  ], color);

  /* Path parallel to the y-axis */
  this.path([
    origin,
    new Point(origin.x + dx / 2, origin.y + dy / 2, origin.z + dz),
    new Point(origin.x, origin.y + dy, origin.z)
  ], color);
};

