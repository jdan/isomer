var THREE = require('three');

function Geometry() {
  throw new Error("You must extend this class");
}

Geometry.prototype._apply = function (matrix) {
  this.geometry.applyMatrix(matrix);
  return this;
};

Geometry.prototype.translate = function (dx, dy, dz) {
  return this._apply(new THREE.Matrix4().makeTranslation(dx, dy, dz));
};

Geometry.prototype.scale = function (x, y, z) {
  return this._apply(new THREE.Matrix4().makeScale(x, y, z));
};

Geometry.prototype.rotateX = function (theta) {
  return this._apply(new THREE.Matrix4().makeRotationX(theta));
};

Geometry.prototype.rotateY = function (theta) {
  return this._apply(new THREE.Matrix4().makeRotationY(theta));
};

Geometry.prototype.rotateZ = function (theta) {
  return this._apply(new THREE.Matrix4().makeRotationZ(theta));
};

module.exports = Geometry;
