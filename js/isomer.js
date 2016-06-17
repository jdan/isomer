var Canvas = require('./canvas');
var Color = require('./color');
var Path = require('./path');
var Point = require('./point');
var Shape = require('./shape');
var Vector = require('./vector');

class Isomer {
  constructor(canvasId, options) {
    options = options || {};
    this.canvas = new Canvas(canvasId);
    this.angle = Math.PI / 6;
    this.scale = options.scale || 70;
    this._calculateTransformation();
    this.originX = options.originX || this.canvas.width / 2;
    this.originY = options.originY || this.canvas.height * 0.9;
    this.lightPosition = options.lightPosition || new Vector(2, -1, 3);
    this.lightAngle = this.lightPosition.normalize();
    this.colorDifference = 0.20;
    this.lightColor = options.lightColor || new Color(255, 255, 255);
  }
  setLightPosition(x, y, z) {
    this.lightPosition = new Vector(x, y, z);
    this.lightAngle = this.lightPosition.normalize();
  }
  _translatePoint(point) {
    var xMap = new Point(point.x * this.transformation[0][0], point.x * this.transformation[0][1]);
    var yMap = new Point(point.y * this.transformation[1][0], point.y * this.transformation[1][1]);
    var x = this.originX + xMap.x + yMap.x;
    var y = this.originY - xMap.y - yMap.y - (point.z * this.scale);
    return new Point(x, y);
  }
  add(item, baseColor) {
    if (Object.prototype.toString.call(item) == '[object Array]') {
      for (var i = 0; i < item.length; i++) {
        this.add(item[i], baseColor)

      };

    } else if (item instanceof Path) {
        this._addPath(item, baseColor);

    } else if (item instanceof Shape) {
      var paths = item.orderedPaths();
      for (var j = 0; j < paths.length; j++) {
        this._addPath(paths[j], baseColor);
      }

    }
  }
  _addPath(path, baseColor) {
    baseColor = baseColor || new Color(120, 120, 120);
    var v1 = Vector.fromTwoPoints(path.points[1], path.points[0]);
    var v2 = Vector.fromTwoPoints(path.points[2], path.points[1]);
    var normal = Vector.crossProduct(v1, v2).normalize();
    var brightness = Vector.dotProduct(normal, this.lightAngle);
    var color = baseColor.lighten(brightness * this.colorDifference, this.lightColor);
    this.canvas.path(path.points.map(this._translatePoint.bind(this)), color);
  }
  _calculateTransformation() {
    this.transformation = [
      [      
        this.scale * Math.cos(this.angle),
        this.scale * Math.sin(this.angle)
      ],
      [
        this.scale * Math.cos(Math.PI - this.angle),
        this.scale * Math.sin(Math.PI - this.angle)
      ]
    ];   
  }
}

Isomer.Canvas = Canvas;
Isomer.Color = Color;
Isomer.Path = Path;
Isomer.Point = Point;
Isomer.Shape = Shape;
Isomer.Vector = Vector;

module.exports.Isomer = Isomer;
