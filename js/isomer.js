var Color = require('./color');
var Point = require('./point');
var Path = require('./path');
var Shape = require('./shape');
var THREE = require('three');


/**
 * The Isomer class
 *
 * This file contains the Isomer base definition
 */
function Isomer(canvas, options) {
    options = options || {};

    this.canvas = canvas;

    this.width    = options.width    || this.canvas.offsetWidth;
    this.height = options.height || this.canvas.offsetHeight;
    this.zoom     = options.zoom     || 10;

    /* Declare the scene */
    this.scene = new THREE.Scene();

    /* Set up the orthographic (isometric) camera */
    var aspect = this.width / this.height;
    this.camera = new THREE.OrthographicCamera(
        -this.zoom * aspect,
        this.zoom * aspect,
        this.zoom,
        -this.zoom,
        1,
        1000);

    this.camera.position.set(-100, 100, -100);
    this.camera.lookAt({x: 0, y: 10, z: 0});

    this.shadows = options.shadows;

    // Set the global light
    var light = new THREE.DirectionalLight(0xFFFFFF);

    if (this.shadows) {
        light.castShadow = true;
        light.shadowMapWidth = 2048;
        light.shadowMapHeight = 2048;
        light.shadowCameraNear = -20;
        light.shadowCameraFar = 20;
        light.shadowCameraTop = 20;
        light.shadowCameraBottom = -20;
        light.shadowCameraLeft = -20;
        light.shadowCameraRight = 20;
    }

    light.position.set(2, 1.5, -2).normalize();
    this.scene.add(light);

    // A second, dimmer light from the -x axis
    var dimLight = new THREE.DirectionalLight(0xFFFFFF);
    dimLight.intensity = 0.4;
    dimLight.position.set(-1, 0, 0).normalize();
    this.scene.add(dimLight);

    // Declare a scene renderer
    this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas: this.canvas,
        devicePixelRatio: window.devicePixelRatio || 1
    });

    if (this.shadows) {
        this.renderer.shadowMapEnabled = true;
    }

    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(this.width, this.height);
}


// Namespace our primitives
Isomer.Color = Color;
Isomer.Point = Point;
Isomer.Path = Path;
Isomer.Shape = Shape;


/**
 * Adds a shape or path to the scene
 */
Isomer.prototype.add = function(item, point, color) {
    var material, mesh, geometry;
    // TODO: add a group!

    var epsilon = 0.001;
    if (item instanceof Path) {
        geometry = (new Shape.Extrude(item, epsilon)).geometry;
    } else {
        geometry = item.geometry;
    }

    if (color instanceof Color) {
        color = color.toHex();
    }

    material = new THREE.MeshLambertMaterial({
        color: color,
        side: THREE.FrontSide
    });
    mesh = new THREE.Mesh(geometry, material);

    if (this.shadows) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
    }

    // Translate to the given origin specified by the user
    mesh.applyMatrix(
        new THREE.Matrix4().makeTranslation(point.x, point.y, point.z));

    this.scene.add(mesh);
};


Isomer.prototype.render = function () {
    this.renderer.render(this.scene, this.camera);
};


// Expose Isomer API
module.exports = Isomer;
