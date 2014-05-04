/**
 * Path utility class
 *
 * An Isomer.Path consists of a list of Isomer.Point's
 */
(function (exports) {

  function Path(points) {
    if (Object.prototype.toString.call(points) === '[object Array]') {
      this.points = points;
    } else {
      this.points = Array.prototype.slice.call(arguments);
    }
  }


  /**
   * Pushes a point onto the end of the path
   */
  Path.prototype.push = function (point) {
    this.points.push(point);
  };


  /**
   * Returns a new path with the points in reverse order
   */
  Path.prototype.reverse = function () {
    var points = Array.prototype.slice.call(this.points);

    return new Path(points.reverse());
  };


  /**
   * Translates a given path
   *
   * Simply a forward to Point#translate
   */
  Path.prototype.translate = function () {
    var args = arguments;

    return new Path(this.points.map(function (point) {
      return point.translate.apply(point, args);
    }));
  };


  /**
   * Returns a new path rotated along the Z axis by a given origin
   *
   * Simply a forward to Point#rotateZ
   */
  Path.prototype.rotateZ = function () {
    var args = arguments;

    return new Path(this.points.map(function (point) {
      return point.rotateZ.apply(point, args);
    }));
  };


  /**
   * Scales a path about a given origin
   *
   * Simply a forward to Point#scale
   */
  Path.prototype.scale = function () {
    var args = arguments;

    return new Path(this.points.map(function (point) {
      return point.scale.apply(point, args);
    }));
  };


  /**
   * The estimated depth of a path as defined by the average depth
   * of its points
   */
  Path.prototype.depth = function () {
    var i, total = 0;
    for (i = 0; i < this.points.length; i++) {
      total += this.points[i].depth();
    }

    return total / (this.points.length || 1);
  };


  /**
   * If pathB ("this") is closer from the observer than pathA, it must be drawn after.
   * It is closer if one of its vertices and the observer are on the same side of the plane defined by pathA.
   */
  Path.prototype.closerThan = function(pathA, observer) {
    var result = pathA._countCloserThan(this, observer) - this._countCloserThan(pathA, observer);
	//console.log(result);
	return result;
  }
  
  Path.prototype._countCloserThan = function(pathA, observer) {
    //console.log("counting");
    var Vector = Isomer.Vector;
	var i = 0;
	
	//console.log("pathA");
	//console.log(pathA);
    // the plane containing pathA is defined by the three points A, B, C
    var AB = Vector.fromTwoPoints(pathA.points[0], pathA.points[1]);
    var AC = Vector.fromTwoPoints(pathA.points[0], pathA.points[2]);
    var n = Vector.crossProduct(AB, AC);
	// console.log("AB AC n A d n.OU :");
	// console.log(AB);
	// console.log(AC);
	// console.log(n);
	// console.log(pathA.points[0]);
   
    var OA = Vector.fromTwoPoints(Point.ORIGIN, pathA.points[0]);
    var OU = Vector.fromTwoPoints(Point.ORIGIN, observer); //U = user = observer

    // Plane defined by pathA such as ax + by + zc = d
    // Here d = nx*x + ny*y + nz*z = n.OA
    var d = Vector.dotProduct(n, OA);
	// console.log(d);
    var observerPosition = Vector.dotProduct(n, OU) - d;
	// console.log(Vector.dotProduct(n, OU));
	var result = 0;
    for (i = 0; i < this.points.length; i++) {
      var OP = Vector.fromTwoPoints(Point.ORIGIN, this.points[i]);
	  // console.log("OP");
	  // console.log(OP);
      var pPosition = Vector.dotProduct(n, OP) - d;
	  // console.log(Vector.dotProduct(n, OP));
	  // console.log(i+" prod = "+(observerPosition * pPosition));
      if(observerPosition * pPosition >= -0.01){
        result++;
      }
    }
	//console.log("__" + (result / this.points.length));
    return (result / this.points.length); 

  };
  



  /**
   * Some paths to play with
   */

  /**
   * A rectangle with the bottom-left corner in the origin
   */
  Path.Rectangle = function (origin, width, height) {
    if (width === undefined) width = 1;
    if (height === undefined) height = 1;

    var path = new Path([
      origin,
      new Point(origin.x + width, origin.y, origin.z),
      new Point(origin.x + width, origin.y + height, origin.z),
      new Point(origin.x, origin.y + height, origin.z)
    ]);

    return path;
  };


  /**
   * A circle centered at origin with a given radius and number of vertices
   */
  Path.Circle = function (origin, radius, vertices) {
    vertices = vertices || 20;
    var i, path = new Path();

    for (i = 0; i < vertices; i++) {
      path.push(new Point(
        radius * Math.cos(i * 2 * Math.PI / vertices),
        radius * Math.sin(i * 2 * Math.PI / vertices),
        0));
    }

    return path.translate(origin.x, origin.y, origin.z);
  };


  /**
   * A star centered at origin with a given outer radius, inner
   * radius, and number of points
   *
   * Buggy - concave polygons are difficult to draw with our method
   */
  Path.Star = function (origin, outerRadius, innerRadius, points) {
    var i, r, path = new Path();

    for (i = 0; i < points * 2; i++) {
      r = (i % 2 === 0) ? outerRadius : innerRadius;

      path.push(new Point(
        r * Math.cos(i * Math.PI / points),
        r * Math.sin(i * Math.PI / points),
        0));
    }

    return path.translate(origin.x, origin.y, origin.z);
  };


  /* Expose the Path constructor */
  exports.Path = Path;

})(Isomer);
