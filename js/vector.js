(function (exports) {

  function Vector(i, j, k) {
    if (i === undefined) i = 0;
    if (j === undefined) j = 0;
    if (k === undefined) k = 0;

    this.i = i;
    this.j = j;
    this.k = k;
  }

  /**
   * Alternate constructor
   */
  Vector.fromTwoPoints = function (p1, p2) {
    return new Vector(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
  };

  Vector.crossProduct = function (v1, v2) {
    var i = v1.j * v2.k - v2.j * v1.k;
    var j = -1 * (v1.i * v2.k - v2.i * v1.k);
    var k = v1.i * v2.j - v2.i * v1.j;

    return new Vector(i, j, k);
  };

  Vector.dotProduct = function (v1, v2) {
    return v1.i * v2.i + v1.j * v2.j + v1.k * v2.k;
  };

  Vector.prototype.magnitude = function () {
    return Math.sqrt(this.i*this.i + this.j*this.j + this.k*this.k);
  };

  Vector.prototype.normalize = function () {
    var magnitude = this.magnitude();
    return new Vector(this.i / magnitude, this.j / magnitude, this.k / magnitude);
  };

  exports.Vector = Vector;

})(Isomer);
