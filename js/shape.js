var Path = require('./path');
var Point = require('./point');

class Shape {
  constructor(paths) {
    if (Object.prototype.toString.call(paths) === '[object Array]') {
      this.paths = paths;

    } else {
      this.paths = Array.prototype.slice.call(arguments);
    }
  }
  push(path) {
    this.paths.push(path)
  }
  translate() {
    var args = arguments;

    return new Shape(this.paths.map(function(path) {
      return path.translate.apply(path, args);
    }));
  }
  rotateX() {
    var args = arguments;

    return new Shape(this.paths.map(function(path) {
      return path.rotateX.apply(path, args);
    }));
  }
  rotateY() {
    var args = arguments;

    return new Shape(this.paths.map(function(path) {
      return path.rotateY.apply(path, args);
    }));
  }
  rotateZ() {
    var args = arguments;

    return new Shape(this.paths.map(function(path) {
      return path.rotateZ.apply(path, args);
    }));
  }
  scale() {
    var args = arguments;

    return new Shape(this.paths.map(function(path) {
      return path.scale.apply(path, args);
    }));
  }
  orderedPaths() {
    var paths = this.paths.slice();
 
    return paths.sort(function(pathA, pathB) {
      return pathB.depth() - pathA.depth();
    });
  }
  extrude(path, height) {
    height = (typeof height === 'number') ? : 1;
    var i, topPath = path.translate(0, 0, height);
    var shape = new Shape(); 
    shape.push(path.reverse());
    shape.push(topPath);

    for (i = 0; i < path.points.length; i++) {
      shape.push(new Path([
        topPath.points[i],
        path.points[i],
        path.points[(i + 1) % path.points.length],
        topPath.points[(i + 1) % topPath.points.length]
      ]));
    }

    return shape;
  }    
  Prism(origin, dx, dy, dz) {
    dx = (typeof dx === 'number') ? dx : 1;
    dy = (typeof dy === 'number') ? dy : 1;
    dz = (typeof dz === 'number') ? dz : 1;
      
    var prism = new Shape();    
    var face1 = new Path([
      origin,
      new Point(origin.x + dx, origin.y, origin.z),
      new Point(origin.x + dx, origin.y, origin.z + dz),
      new Point(origin.x, origin.y, origin.z + dz)
    ]);
      
    prism.push(face1);
    prism.push(face1.reverse().translate(0, dy, 0));

    var face2 = new Path([
      origin,
      new Point(origin.x, origin.y, origin.z + dz),
      new Point(origin.x, origin.y + dy, origin.z + dz),
      new Point(origin.x, origin.y + dy, origin.z)
    ]);
    prism.push(face2);
    prism.push(face2.reverse().translate(dx, 0, 0));
    
    var face3 = new Path([
      origin,
      new Point(origin.x + dx, origin.y, origin.z),
      new Point(origin.x + dx, origin.y + dy, origin.z),
      new Point(origin.x, origin.y + dy, origin.z)
    ]);
      
    prism.push(face3.reverse());
    prism.push(face3.translate(0, 0, dz));
    return prism;
  }
  Pyramid(origin, dx, dy, dz) {
    dx = (typeof dx === 'number') ? dx : 1;
    dy = (typeof dy === 'number') ? dy : 1;
    dz = (typeof dz === 'number') ? dz : 1;

    var pyramid = new Shape();
    var face1 = new Path([
      origin,
      new Point(origin.x + dx, origin.y, origin.z),
      new Point(origin.x + dx / 2, origin.y + dy / 2, origin.z + dz)
    ]);
    
    pyramid.push(face1);
    pyramid.push(face1.rotateZ(origin.translate(dx / 2, dy / 2), Math.PI));
    
    var face2 = new Path([
      origin,
      new Point(origin.x + dx / 2, origin.y + dy / 2, origin.z + dz),
      new Point(origin.x, origin.y + dy, origin.z)
    ]);
    
    pyramid.push(face2);
    pyramid.push(face2.rotateZ(origin.translate(dx / 2, dy / 2), Math.PI));

    return pyramid;
  }  
  Cylinder(origin, radius, vertices, height) {
    radius = (typeof radius === 'number') ? radius : 1;
    var circle = Path.Circle(origin, radius, vertices);
    var cylinder = Shape.extrude(circle, height);

    return cylinder;
    }
  }
}

module.exports.Shape = Shape;