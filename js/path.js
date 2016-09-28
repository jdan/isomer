var Point = require('./point');

/**
 * Path utility class
 *
 * An Isomer.Path consists of a list of Isomer.Point's
 */
class Path {
  constructor(points) {
    if (Object.prototype.toString.call(points) === '[object Array]') {
      this.points = points;
    } else {
      this.points = Array.prototype.slice.call(arguments);
    }
  }	


  /**
   * Pushes a point onto the end of the path
   */
  push(point) {
    this.points.push(point);
  }


  /**
   * Returns a new path with the points in reverse order
   */
  reverse() {
    var points = Array.prototype.slice.call(this.points);

    return new Path(points.reverse());
  }


  /**
   * Translates a given path
   *
   * Simply a forward to Point#translate
   */
  translate() {
    var args = arguments;

    return new Path(this.points.map(function(point) {
      return point.translate.apply(point, args);
    }));
  }

  /**
   * Returns a new path rotated along the X axis by a given origin
   *
   * Simply a forward to Point#rotateX
   */
  rotateX() {
    var args = arguments;

    return new Path(this.points.map(function(point) {
      return point.rotateX.apply(point, args);
    }));
  }

  /**
   * Returns a new path rotated along the Y axis by a given origin
   *
   * Simply a forward to Point#rotateY
   */
  rotateY() {
    var args = arguments;

    return new Path(this.points.map(function(point) {
      return point.rotateY.apply(point, args);
    }));
  }

  /**
   * Returns a new path rotated along the Z axis by a given origin
   *
   * Simply a forward to Point#rotateZ
   */
  rotateZ() {
    var args = arguments;

    return new Path(this.points.map(function(point) {
      return point.rotateZ.apply(point, args);
    }));
  }


  /**
   * Scales a path about a given origin
   *
   * Simply a forward to Point#scale
   */
  scale() {
    var args = arguments;

    return new Path(this.points.map(function(point) {
      return point.scale.apply(point, args);
    }));
  }


  /**
   * The estimated depth of a path as defined by the average depth
   * of its points
   */
  depth() {
    var i, total = 0;
    for (i = 0; i < this.points.length; i++) {
      total += this.points[i].depth();
    }

    return total / (this.points.length || 1);
  }


  /**
   * Some paths to play with
   */

  /**
   * A rectangle with the bottom-left corner in the origin
   */
  static Rectangle(origin, width, height) {
    if (width === undefined) width = 1;
    if (height === undefined) height = 1;

    var path = new Path([
      origin,
      new Point(origin.x + width, origin.y, origin.z),
      new Point(origin.x + width, origin.y + height, origin.z),
      new Point(origin.x, origin.y + height, origin.z)
    ]);

    return path;
  }


  /**
   * A circle centered at origin with a given radius and number of vertices
   */
  static Circle(origin, radius, vertices) {
    vertices = vertices || 20;
    var i, path = new Path();

    for (i = 0; i < vertices; i++) {
      path.push(new Point(
        radius * Math.cos(i * 2 * Math.PI / vertices),
        radius * Math.sin(i * 2 * Math.PI / vertices),
        0));
    }

    return path.translate(origin.x, origin.y, origin.z);
  }


  /**
   * A star centered at origin with a given outer radius, inner
   * radius, and number of points
   *
   * Buggy - concave polygons are difficult to draw with our method
   */
  static Star(origin, outerRadius, innerRadius, points) {
    var i, r, path = new Path();

    for (i = 0; i < points * 2; i++) {
      r = (i % 2 === 0) ? outerRadius : innerRadius;

      path.push(new Point(
        r * Math.cos(i * Math.PI / points),
        r * Math.sin(i * Math.PI / points),
        0));
    }

    return path.translate(origin.x, origin.y, origin.z);
  }

}


/* Expose the Path constructor */
module.exports = Path;
