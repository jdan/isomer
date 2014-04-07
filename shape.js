/**
 * Shape utility class
 *
 * An Isomer.Shape consists of a list of Isomer.Path's
 */
(function (exports) {

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
  Shape.prototype.push = function (path) {
    this.paths.push(path);
  };


  /**
   * Translates a given shape
   *
   * Simply a forward to Path#translate
   */
  Shape.prototype.translate = function () {
    var args = arguments;

    return new Shape(this.paths.map(function (path) {
      return path.translate.apply(path, args);
    }));
  };


  /**
   * Rotates a given shape along the Z axis around a given origin
   *
   * Simply a forward to Path#rotateZ
   */
  Shape.prototype.rotateZ = function () {
    var args = arguments;

    return new Shape(this.paths.map(function (path) {
      return path.rotateZ.apply(path, args);
    }));
  };


  /**
   * Scales a path about a given origin
   *
   * Simply a forward to Point#scale
   */
  Shape.prototype.scale = function () {
    var args = arguments;

    return new Shape(this.paths.map(function (path) {
      return path.scale.apply(path, args);
    }));
  };


  /**
   * Some shapes to play with
   */

  /**
   * A prism located at origin with dimensions dx, dy, dz and color
   */
  Shape.Prism = function (origin, dx, dy, dz, color) {
    dx = dx || 1;
    dy = dy || 1;
    dz = dz || 1;

    /* We only need to draw the front 3 squares */
    var Path = Isomer.Path;
    var Point = Isomer.Point;

    /* Square parallel to the x-axis */
    var face1 = new Path([
      origin,
      new Point(origin.x + dx, origin.y, origin.z),
      new Point(origin.x + dx, origin.y, origin.z + dz),
      new Point(origin.x, origin.y, origin.z + dz)
    ]);

    /* Square parallel to the y-axis */
    var face2 = new Path([
      origin,
      new Point(origin.x, origin.y, origin.z + dz),
      new Point(origin.x, origin.y + dy, origin.z + dz),
      new Point(origin.x, origin.y + dy, origin.z)
    ]);

    /* Square parallel to the xy-plane */
    var face3 = new Path([
      new Point(origin.x, origin.y, origin.z + dz),
      new Point(origin.x + dx, origin.y, origin.z + dz),
      new Point(origin.x + dx, origin.y + dy, origin.z + dz),
      new Point(origin.x, origin.y + dy, origin.z + dz)
    ]);

    return new Shape(face1, face2, face3);
  };

  Shape.Pyramid = function (origin, dx, dy, dz) {
    dx = dx || 1;
    dy = dy || 1;
    dz = dz || 1;

    /* We only need to draw the two visible faces */
    var Path = Isomer.Path;
    var Point = Isomer.Point;

    /* Path parallel to the x-axis */
    var face1 = new Path([
      origin,
      new Point(origin.x + dx, origin.y, origin.z),
      new Point(origin.x + dx / 2, origin.y + dy / 2, origin.z + dz)
    ]);

    /* Path parallel to the y-axis */
    var face2 = new Path([
      origin,
      new Point(origin.x + dx / 2, origin.y + dy / 2, origin.z + dz),
      new Point(origin.x, origin.y + dy, origin.z)
    ]);

    return new Shape(face1, face2);
  };

  exports.Shape = Shape;

})(Isomer);
