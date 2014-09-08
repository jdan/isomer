//var Color = require('./color');
//var Path = require('./path');
var Point = require('./point');
var Shape = require('./shape');
//var Vector = require('./vector');
var THREE = require('three');


/**
 * The Isomer class
 *
 * This file contains the Isomer base definition
 */
function Isomer(canvas, options) {
  options = options || {};

  this.canvas = canvas;

  this.width  = options.width  || this.canvas.offsetWidth;
  this.height = options.height || this.canvas.offsetHeight;
  this.zoom   = options.zoom   || 10;

  /* Declare the scene */
  this.scene = new THREE.Scene();

  /* Set up the orthographic (isometric) camera */
  var aspect = this.width / this.height;
  this.camera = new THREE.OrthographicCamera(
      -this.zoom * aspect, this.zoom * aspect, this.zoom, -this.zoom, 1, 1000);
  this.camera.position.set(-100, 100, -100);
  this.camera.lookAt({x: 0, y: 10, z: 0});

  /* Set the global light */
  var light = new THREE.DirectionalLight(0xFFFFFF);
  light.position.set(-2, 2.5, -1).normalize();
  this.scene.add(light);

  /* Declare a scene renderer */
  this.renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: this.canvas,
    devicePixelRatio: window.devicePixelRatio || 1
  });
  this.renderer.setClearColor(0x000000, 0);
  this.renderer.setSize(this.width, this.height);
}


/* Namespace our primitives */
//Isomer.Canvas = Canvas;
//Isomer.Color = Color;
//Isomer.Path = Path;
Isomer.Point = Point;
Isomer.Shape = Shape;
//Isomer.Vector = Vector;


/**
 * Adds a shape or path to the scene
 *
 * This method also accepts arrays
 */
Isomer.prototype.add = function (point, shape, color) {
  var material, mesh;
  // TODO: add a face!
  material = new THREE.MeshLambertMaterial({ color: color });
  mesh = new THREE.Mesh(shape.geometry, material);
  mesh.applyMatrix(new THREE.Matrix4().makeTranslation(point.x, point.y, point.z));

  this.scene.add(mesh);
};


Isomer.prototype.render = function () {
  this.renderer.render(this.scene, this.camera);
};


/* Expose Isomer API */
module.exports = Isomer;
