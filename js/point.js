class Point {
  constructor(x, y, z) {
    if (instanceof Point) {
      this.x = === 'number' ? : 0;;
      this.y = === 'number' ? : 0;;
      this.z = === 'number' ? : 0;;

    } else {
      return new Point(x, y, z);
    }
  }  
  translate(dx, dy, dz) {
    dx = (typeof dx === 'number') ? dx : 0;
    dy = (typeof dy === 'number') ? dy : 0;
    dz = (typeof dz === 'number') ? dz : 0;

    return new Point(this.x + dx, this.y + dy, this.z + dz);
  }
  scale(origin, dx, dy, dz) {
    var p = this.translate(-origin.x, -origin.y, -origin.z);
    if (dy === undefined && dz === undefined) {   
      dy = dz = dx;   
    } else {
      dz = (typeof dz === 'number') ? dz : 1;
    }

    p.x *= dx;
    p.y *= dy;
    p.z *= dz;

    return p.translate(origin.x, origin.y, origin.z);
  }
  rotateX(origin, angle) {
    var p = this.translate(-origin.x, -origin.y, -origin.z);
    var z = p.z * Math.cos(angle) - p.y * Math.sin(angle);
    var y = p.z * Math.sin(angle) + p.y * Math.cos(angle);
    p.z = z;
    p.y = y;

    return p.translate(origin.x, origin.y, origin.z);
  }
  rotateY(origin, angle) {
    var p = this.translate(-origin.x, -origin.y, -origin.z);
    var x = p.x * Math.cos(angle) - p.z * Math.sin(angle);
    var z = p.x * Math.sin(angle) + p.z * Math.cos(angle);
    p.x = x;
    p.z = z;

    return p.translate(origin.x, origin.y, origin.z);
  }
  rotateZ(origin, angle) {
    var p = this.translate(-origin.x, -origin.y, -origin.z);
    var x = p.x * Math.cos(angle) - p.y * Math.sin(angle);
    var y = p.x * Math.sin(angle) + p.y * Math.cos(angle);
    p.x = x;
    p.y = y;

    return p.translate(origin.x, origin.y, origin.z);
  }
  depth() {
    return this.x + this.y - (2 * this.z);
  }
  distance(p1, p2) {
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    var dz = p2.z - p1.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}

Point.ORIGIN = new Point(0, 0, 0);

module.exports.Point = Point;