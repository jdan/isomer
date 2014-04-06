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

  /* Expose the Path constructor */
  exports.Path = Path;

})(Isomer);
