//var Canvas = require('./canvas');
//var Color = require('./color');
//var Path = require('./path');
var Point = require('./point');
var Shape = require('./shape');
//var Vector = require('./vector');
var THREE = require('three');


/**
 * The Isomer class
 *
 * This file contains the Isomer base definition
 */
function Isomer(canvas, options) {
  options = options || {};

  this.canvas = canvas;

  this.width  = options.width  || this.canvas.offsetWidth;
  this.height = options.height || this.canvas.offsetHeight;
  this.zoom   = options.zoom   || 10;

  /* Declare the scene */
  this.scene = new THREE.Scene();

  /* Set up the orthographic (isometric) camera */
  var aspect = this.width / this.height;
  this.camera = new THREE.OrthographicCamera(
      -this.zoom * aspect, this.zoom * aspect, this.zoom, -this.zoom, 1, 1000);
  this.camera.position.set(-100, 100, -100);
  this.camera.lookAt({x: 0, y: 10, z: 0});

  /* Set the global light */
  var light = new THREE.DirectionalLight(0xFFFFFF);
  light.position.set(-2, 2.5, -1).normalize();
  this.scene.add(light);

  /* Declare a scene renderer */
  this.renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: this.canvas,
    devicePixelRatio: window.devicePixelRatio || 1
  });
  this.renderer.setClearColor(0x000000, 0);
  this.renderer.setSize(this.width, this.height);
}


/* Namespace our primitives */
//Isomer.Canvas = Canvas;
//Isomer.Color = Color;
//Isomer.Path = Path;
Isomer.Point = Point;
Isomer.Shape = Shape;
//Isomer.Vector = Vector;


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
  var xMap = new Point(point.x * this.transformation[0][0],
                       point.x * this.transformation[0][1]);

  var yMap = new Point(point.y * this.transformation[1][0],
                       point.y * this.transformation[1][1]);

  var x = this.originX + xMap.x + yMap.x;
  var y = this.originY - xMap.y - yMap.y - (point.z * this.scale);
  return new Point(x, y);
};


/**
 * Adds a shape or path to the scene
 *
 * This method also accepts arrays
 */
Isomer.prototype.add = function (point, geometry, color) {
  var material = new THREE.MeshLambertMaterial({ color: color });
  var mesh = new THREE.Mesh(geometry, material);
  mesh.applyMatrix(new THREE.Matrix4().makeTranslation(point.x, point.y, point.z));

  this.scene.add(mesh);
};


Isomer.prototype.render = function () {
  this.renderer.render(this.scene, this.camera);
};

// Isomer.prototype.add = function (item, baseColor) {
//   if (Object.prototype.toString.call(item) == '[object Array]') {
//     for (var i = 0; i < item.length; i++) {
//       this.add(item[i], baseColor);
//     }
//   } else if (item instanceof Path) {
//     this._addPath(item, baseColor);
//   } else if (item instanceof Shape) {
//     /* Fetch paths ordered by distance to prevent overlaps */
//     var paths = item.orderedPaths();
//     for (var i in paths) {
//       this._addPath(paths[i], baseColor);
//     }
//   }
// };


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


/**
 * Precalculates transformation values based on the current angle and scale
 * which in theory reduces costly cos and sin calls
 */
Isomer.prototype._calculateTransformation = function () {
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



/* Expose Isomer API */
module.exports = Isomer;
