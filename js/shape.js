var Geometry = require('./geometry');
var Point = require('./point');
var inherits = require('inherits');
var THREE = require('three');

/**
 * Shape utility class
 * Accepts either:
 * - a geometry (ShapeGeometry, for example)
 *
 *    new Shape(new THREE.IcosohedronGeometry(...));
 *
 * - an array of faces
 *
 *    new Shape([face1, face2, ... ])
 *
 * - a list of faces as the arguments to the functions
 *
 *    new Shape(face1, face2, ...)
 */
function Shape(geometry) {
  var faces;

  if (arguments.length > 1) {
    /* Many faces */
    faces = Array.prototype.slice.call(arguments);
  } else if (Object.prototype.toString.call(geometry) === '[object Array]') {
    faces = geometry;
  }

  if (faces) {
    this.geometry = new THREE.ShapeGeometry(faces);
  } else {
    this.geometry = geometry;
  }
}
inherits(Shape, Geometry);


/**
 * Some primitives
 */
Shape.Box = function (width, height, depth) {
  var geometry = new THREE.BoxGeometry(width, height, depth);
  geometry.applyMatrix(new THREE.Matrix4().makeTranslation(width/2, height/2, depth/2));
  return new Shape(geometry);
};


module.exports = Shape;
