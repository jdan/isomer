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
   * Produces a list of the shape's paths ordered by distance to
   * prevent overlaps when drawing
   */
  Shape.prototype.orderedPaths = function () {
    var Point = Isomer.Point;

    var observer = new Point(-10, -10, 10);

    /**
     * Create a list of paths combined with their point that is located
     * furthest from the observer.
     *
     * This makes it so we only have to computer furthestPointInPath once
     * for each face.
     */
    var paths = this.paths.slice().map(function (path) {
      var distances = this._pathDistances(path, observer);

      return {
        path: path,
        furthestDistance: distances.furthestDistance,
        averageDistance: distances.averageDistance
      };
    }.bind(this));

    /**
     * Sort the list of faces by distance then map the entries, returning
     * only the path and not the added "further point" from earlier.
     */
    return paths.sort(function (pathA, pathB) {
      return pathB.averageDistance - pathA.averageDistance;
    }.bind(this)).map(function (item) {
      return item.path;
    });
  };


  /**
   * Helper method to find
   * - furthest point in a path to an observer
   * - distance of the furthest point to an observer
   * - averange distance of all points to an observer
   */
  Shape.prototype._pathDistances = function (path, destination) {
    var maxPoint, maxDistance, i, distance, totalDistance;

    maxPoint = path.points[0];
    maxDistance = Point.distance(maxPoint, destination);
    totalDistance = 0;

    for (i = 0; i < path.points.length; i++) {
      distance = Point.distance(path.points[i], destination);
      if (distance > maxDistance) {
        maxDistance = distance;
        maxPoint = path.points[i];
      }

      totalDistance += distance;
    }

    return {
      furthestPoint: maxPoint,
      furthestDistance: maxDistance,
      averageDistance: totalDistance / path.points.length
    }
  };


  /**
   * Utility function to create a 3D object by raising a 2D path
   * along the z-axis
   */
  Shape.emboss = function (path, height) {
    height = height || 1;

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
   * A prism located at origin with dimensions dx, dy, dz and color
   */
  Shape.Prism = function (origin, dx, dy, dz, color) {
    dx = dx || 1;
    dy = dy || 1;
    dz = dz || 1;

    var Path = Isomer.Path;
    var Point = Isomer.Point;

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

  Shape.Pyramid = function (origin, dx, dy, dz) {
    dx = dx || 1;
    dy = dy || 1;
    dz = dz || 1;

    var Path = Isomer.Path;
    var Point = Isomer.Point;

    var pyramid = new Shape();

    /* Path parallel to the x-axis */
    var face1 = new Path([
      origin,
      new Point(origin.x + dx, origin.y, origin.z),
      new Point(origin.x + dx / 2, origin.y + dy / 2, origin.z + dz)
    ]);
    /* Push the face, and its opposite face, by rotating around the Z-axis */
    pyramid.push(face1);
    pyramid.push(face1.rotateZ(origin.translate(dx/2, dy/2), Math.PI));

    /* Path parallel to the y-axis */
    var face2 = new Path([
      origin,
      new Point(origin.x + dx / 2, origin.y + dy / 2, origin.z + dz),
      new Point(origin.x, origin.y + dy, origin.z)
    ]);
    pyramid.push(face2);
    pyramid.push(face2.rotateZ(origin.translate(dx/2, dy/2), Math.PI));

    return pyramid;
  };

  exports.Shape = Shape;

})(Isomer);
