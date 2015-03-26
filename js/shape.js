var Geometry = require('./geometry');
var inherits = require('inherits');
var THREE = require('three');

/**
 * This doesn't do much - just holds the geometry and center
 */
function Shape(geometry) {
    this.geometry = geometry;
    this.center = geometry.center;
}
inherits(Shape, Geometry);


/**
 * Create a shape by extruding a path
 */
Shape.Extrude = function (path, distance) {
    return new Shape(new THREE.ExtrudeGeometry(path.base, {
        amount: distance,
        bevelEnabled: false
    }));
};


/**
 * Some primitives
 */
Shape.Box = function (width, height, depth) {
    var geometry = new THREE.BoxGeometry(width, height, depth);
    var box = new Shape(geometry);
    return box.translate(width/2, height/2, depth/2);
};


module.exports = Shape;
