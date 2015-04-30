var Path = require('./path');
var Point = require('./point');
var Vector = require('./vector');

/**
 * Shape utility class
 *
 * An Isomer.Shape consists of a list of Isomer.Path's
 */
function Shape(paths) {
  if (Object.prototype.toString.call(paths) === '[object Array]') {
    this.paths = paths;
  } else {
    this.paths = Array.prototype.slice.call(arguments);
  }
}


/**
 * Pushes a path onto the end of the Shape
 */
Shape.prototype.push = function(path) {
  this.paths.push(path);
};


/**
 * Translates a given shape
 *
 * Simply a forward to Path#translate
 */
Shape.prototype.translate = function() {
  var args = arguments;

  return new Shape(this.paths.map(function(path) {
    return path.translate.apply(path, args);
  }));
};

/**
 * Rotates a given shape along the X axis around a given origin
 *
 * Simply a forward to Path#rotateX
 */
Shape.prototype.rotateX = function() {
  var args = arguments;

  return new Shape(this.paths.map(function(path) {
    return path.rotateX.apply(path, args);
  }));
};

/**
 * Rotates a given shape along the Y axis around a given origin
 *
 * Simply a forward to Path#rotateY
 */
Shape.prototype.rotateY = function() {
  var args = arguments;

  return new Shape(this.paths.map(function(path) {
    return path.rotateY.apply(path, args);
  }));
};

/**
 * Rotates a given shape along the Z axis around a given origin
 *
 * Simply a forward to Path#rotateZ
 */
Shape.prototype.rotateZ = function() {
  var args = arguments;

  return new Shape(this.paths.map(function(path) {
    return path.rotateZ.apply(path, args);
  }));
};

/**
 * Scales a path about a given origin
 *
 * Simply a forward to Point#scale
 */
Shape.prototype.scale = function() {
  var args = arguments;

  return new Shape(this.paths.map(function(path) {
    return path.scale.apply(path, args);
  }));
};


/**
 * Produces a list of the shape's paths ordered by distance to
 * prevent overlaps when drawing
 */
Shape.prototype.orderedPaths = function() {
  var paths = this.paths.slice();

  /**
   * Sort the list of faces by distance then map the entries, returning
   * only the path and not the added "further point" from earlier.
   */
  return paths.sort(function(pathA, pathB) {
    return pathB.depth() - pathA.depth();
  });
};


/**
 * Utility function to create a 3D object by raising a 2D path
 * along the z-axis
 */
Shape.extrude = function(path, height) {
  height = (typeof height === 'number') ? height : 1;

  var i, topPath = path.translate(0, 0, height);
  var shape = new Shape();

  /* Push the top and bottom faces, top face must be oriented correctly */
  shape.push(path.reverse());
  shape.push(topPath);

  /* Push each side face */
  for (i = 0; i < path.points.length; i++) {
    shape.push(new Path([
      topPath.points[i],
      path.points[i],
      path.points[(i + 1) % path.points.length],
      topPath.points[(i + 1) % topPath.points.length]
    ]));
  }

  return shape;
};


/**
 * Some shapes to play with
 */

/**
 * A prism located at origin with dimensions dx, dy, dz
 */
Shape.Prism = function(origin, dx, dy, dz) {
  dx = (typeof dx === 'number') ? dx : 1;
  dy = (typeof dy === 'number') ? dy : 1;
  dz = (typeof dz === 'number') ? dz : 1;

  /* The shape we will return */
  var prism = new Shape();

  /* Squares parallel to the x-axis */
  var face1 = new Path([
    origin,
    new Point(origin.x + dx, origin.y, origin.z),
    new Point(origin.x + dx, origin.y, origin.z + dz),
    new Point(origin.x, origin.y, origin.z + dz)
  ]);

  /* Push this face and its opposite */
  prism.push(face1);
  prism.push(face1.reverse().translate(0, dy, 0));

  /* Square parallel to the y-axis */
  var face2 = new Path([
    origin,
    new Point(origin.x, origin.y, origin.z + dz),
    new Point(origin.x, origin.y + dy, origin.z + dz),
    new Point(origin.x, origin.y + dy, origin.z)
  ]);
  prism.push(face2);
  prism.push(face2.reverse().translate(dx, 0, 0));

  /* Square parallel to the xy-plane */
  var face3 = new Path([
    origin,
    new Point(origin.x + dx, origin.y, origin.z),
    new Point(origin.x + dx, origin.y + dy, origin.z),
    new Point(origin.x, origin.y + dy, origin.z)
  ]);
  /* This surface is oriented backwards, so we need to reverse the points */
  prism.push(face3.reverse());
  prism.push(face3.translate(0, 0, dz));

  return prism;
};


Shape.Pyramid = function(origin, dx, dy, dz) {
  dx = (typeof dx === 'number') ? dx : 1;
  dy = (typeof dy === 'number') ? dy : 1;
  dz = (typeof dz === 'number') ? dz : 1;

  var pyramid = new Shape();

  /* Path parallel to the x-axis */
  var face1 = new Path([
    origin,
    new Point(origin.x + dx, origin.y, origin.z),
    new Point(origin.x + dx / 2, origin.y + dy / 2, origin.z + dz)
  ]);
  /* Push the face, and its opposite face, by rotating around the Z-axis */
  pyramid.push(face1);
  pyramid.push(face1.rotateZ(origin.translate(dx / 2, dy / 2), Math.PI));

  /* Path parallel to the y-axis */
  var face2 = new Path([
    origin,
    new Point(origin.x + dx / 2, origin.y + dy / 2, origin.z + dz),
    new Point(origin.x, origin.y + dy, origin.z)
  ]);
  pyramid.push(face2);
  pyramid.push(face2.rotateZ(origin.translate(dx / 2, dy / 2), Math.PI));

  return pyramid;
};


Shape.Cylinder = function(origin, radius, vertices, height) {
  radius = (typeof radius === 'number') ? radius : 1;

  var circle = Path.Circle(origin, radius, vertices);
  var cylinder = Shape.extrude(circle, height);

  return cylinder;
};

/**
 * draw a sphere with recursive division
 * set detail to change the number of division
 * increasing the number of division increases detail but also computation
 */
Shape.Sphere = function(origin, xradius, yradius, detail) {
    xradius = (typeof xradius === 'number') ? xradius : 1;
    yradius = (typeof yradius === 'number') ? yradius : 1;
    detail = (typeof detail === 'number') ? detail : 3;
    
    var sphere = new Shape();
    var numDivisions = detail;
    var sqrt2 = Math.sqrt(2);
    var sqrt6 = Math.sqrt(6);
    var v1 = new Vector(0.0,0.0,1.0,1.0);
    var v2 = new Vector(0.0,2.0*sqrt2/3.0,-1.0/3.0,1.0);
    var v3 = new Vector(-sqrt6/3.0,-sqrt2/3.0,-1.0/3.0,1.0);
    var v4 = new Vector(sqrt6/3.0,-sqrt2/3.0,-1.0/3.0,1.0);

    divideTriangle = function(a, b, c, count, sphere) {
	if(count > 0) {
	    var v1d = (Vector.add(a,b)).normalize();
	    var v2d = (Vector.add(a,c)).normalize();
	    var v3d = (Vector.add(b,c)).normalize();
	    
	    divideTriangle(a, v1d, v2d, count-1, sphere);
	    divideTriangle(c, v2d, v3d, count-1, sphere);
	    divideTriangle(b, v3d, v1d, count-1, sphere);
	    divideTriangle(v1d, v3d, v2d, count-1, sphere);
	}
	else {
	    var face = new Path([Vector.toPoint(a),
				 Vector.toPoint(b),
				 Vector.toPoint(c)]);
	    sphere.push(face);
	    return sphere;
	}
    };
    
    divideTriangle(v1, v2, v3, numDivisions, sphere);
    divideTriangle(v4, v3, v2, numDivisions, sphere);
    divideTriangle(v1, v4, v2, numDivisions, sphere);
    divideTriangle(v1, v3, v4, numDivisions, sphere);    
    
    return sphere;
};


module.exports = Shape;
