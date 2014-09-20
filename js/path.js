var Point = require('./point');
var Geometry = require('./geometry');
var inherits = require('inherits');
var THREE = require('three');

/**
 * Path utility class
 */
function Path(points) {
  if (!(Object.prototype.toString.call(points) === '[object Array]')) {
    points = Array.prototype.slice.call(arguments);
  }

  this.points = points;
  this.base = new THREE.Shape();
  this.base.moveTo(points[0].x, points[0].y);

  points.slice(1).forEach(function (point) {
    this.base.lineTo(point.x, point.y);
  }.bind(this));

  /* Close */
  this.base.lineTo(points[0].x, points[0].y);

  this.geometry = new THREE.ShapeGeometry(this.base);

  /* Snapshot the center */
  this.center = this.geometry.center;

  /* Path lay flat */
  this.rotateX(Math.PI/2);
}
inherits(Path, Geometry);

module.exports = Path;
