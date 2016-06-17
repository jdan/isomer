class Path {
  constructor(points) {
    if (Object.prototype.toString.call(points) === '[object Array]') {
      this.points = points;

    } else {
      this.points = Array.prototype.slice.call(arguments);
    }
  }
  push(point) {
    this.points.push(point)
  }
  reverse() {
    var points = Array.prototype.slice.call(this.points);

    return new Path(points.reverse());
  }
  translate() {
    var args = arguments;
    return new Path(this.points.map(function(point) {
      return point.translate.apply(point, args);
    }));
  }
  rotateX() {
    var args = arguments;

    return new Path(this.points.map(function(point) {
      return point.rotateX.apply(point, args);
    }));
  }
  rotateY() {
    var args = arguments;

    return new Path(this.points.map(function(point) {
      return point.rotateY.apply(point, args);
    }));
  }
  rotateZ() {
    var args = arguments;

    return new Path(this.points.map(function(point) {
      return point.rotateZ.apply(point, args);
    }));
  }
  scale() {
    var args = arguments;

    return new Path(this.points.map(function(point) {
      return point.scale.apply(point, args);
    }));
  }
  depth() {
    var i, total = 0;
    for (i = 0; i < this.points.length; i++) {
      total += this.points[i].depth();
    }

    return total / (this.points.length || 1);
  }
  Rectangle(origin, width, height) {
    if (width === undefined) width = 1;
    if (height === undefined) height = 1;

    var path = new Path([origin,
      new Point(origin.x + width, origin.y, origin.z),
      new Point(origin.x + width, origin.y + height, origin.z),
      new Point(origin.x, origin.y + height, origin.z)
    ]);

    return path;
  }
  Circle(origin, radius, vertices) {
    vertices = vertices || 20;
    var i, path = new Path();

    for (i = 0; i < vertices; i++) {
      path.push(new Point(radius * Math.cos(i * 2 * Math.PI / vertices), radius * Math.sin(i * 2 * Math.PI / vertices), 0));
    }

    return path.translate(origin.x, origin.y, origin.z);
  }
  Path(origin, outerRadius, innerRadius, points) {
    var i, r, path = new Path();

    for (i = 0; i < points * 2; i++) {
      r = (i % 2 === 0) ? outerRadius : innerRadius;

      path.push(new Point(r * Math.cos(i * Math.PI / points),r * Math.sin(i * Math.PI / points), 0));
    }

    return path.translate(origin.x, origin.y, origin.z);
  }
}

module.exports.Path = Path;