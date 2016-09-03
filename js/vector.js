class Vector {
  constructor(i, j, k) {
    this.i = (typeof i === 'number') ? i : 0;
    this.j = (typeof j === 'number') ? j : 0;
    this.k = (typeof k === 'number') ? k : 0;
  }

  /**
   * Alternate constructor
   */
  static fromTwoPoints(p1, p2) {
    return new Vector(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
  }

  static crossProduct(v1, v2) {
    var i = v1.j * v2.k - v2.j * v1.k;
    var j = -1 * (v1.i * v2.k - v2.i * v1.k);
    var k = v1.i * v2.j - v2.i * v1.j;

    return new Vector(i, j, k);
  }

  static dotProduct(v1, v2) {
    return v1.i * v2.i + v1.j * v2.j + v1.k * v2.k;
  }

  magnitude() {
    return Math.sqrt(this.i * this.i + this.j * this.j + this.k * this.k);
  }

  normalize() {
    var magnitude = this.magnitude();
    /**
     * If the magnitude is 0 then return the zero vector instead of dividing by 0
     */
    if (magnitude === 0) {
      return new Vector(0, 0, 0);
    }
    return new Vector(this.i / magnitude, this.j / magnitude, this.k / magnitude);
  }

}


module.exports = Vector;
