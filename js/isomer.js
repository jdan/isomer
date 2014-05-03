var Canvas = require('./canvas');
var Color = require('./color');
var Path = require('./path');
var Point = require('./point');
var Shape = require('./shape');
var Vector = require('./vector');


/**
 * The Isomer class
 *
 * This file contains the Isomer base definition
 */
function Isomer(canvasId, options) {
  options = options || {};

  this.canvas = new Canvas(canvasId);
  this.angle = Math.PI / 6;

  this.scale = options.scale || 70;

  this.originX = options.originX || this.canvas.width / 2;
  this.originY = options.originY || this.canvas.height * 0.9;

  /**
   * Light source as defined as the angle from
   * the object to the source.
   *
   * We'll define somewhat arbitrarily for now.
   */
  this.lightPosition = options.lightPosition || new Vector(2, -1, 3);
  this.lightAngle = this.lightPosition.normalize();

  /**
   * The maximum color difference from shading
   */
  this.colorDifference = 0.20;
  this.lightColor = options.lightColor || new Color(255, 255, 255);
}

/**
 * Sets the light position for drawing.
 */
Isomer.prototype.setLightPosition = function (x, y, z) {
  this.lightPosition = new Vector(x, y, z);
  this.lightAngle = this.lightPosition.normalize();
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
 *
 * This method also accepts arrays
 */
Isomer.prototype.add = function (item, baseColor) {
  if (Object.prototype.toString.call(item) == '[object Array]') {
    for (var i = 0; i < item.length; i++) {
      this.add(item[i], baseColor);
    }
  } else if (item instanceof Path) {
    this._addPath(item, baseColor);
  } else if (item instanceof Shape) {
    /* Fetch paths ordered by distance to prevent overlaps */
    var paths = item.orderedPaths();
    for (var i in paths) {
      this._addPath(paths[i], baseColor);
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
  color = baseColor.lighten(brightness * this.colorDifference, this.lightColor);

  this.canvas.path(path.points.map(this._translatePoint.bind(this)), color);
};

/* Namespace our primitives */
Isomer.Canvas = Canvas;
Isomer.Color = Color;
Isomer.Path = Path;
Isomer.Point = Point;
Isomer.Shape = Shape;
Isomer.Vector = Vector;

/* Expose Isomer API */
module.exports = Isomer;
