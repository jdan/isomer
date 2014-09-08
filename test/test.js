var iso = new Isomer(document.getElementById("canvas"));
var Point = Isomer.Point;
var Shape = Isomer.Shape;

function init() {
  var i, j, height, color;
  for (i = 0; i < 7; i++) {
    for (j = 0; j < 7; j++) {
      height = Math.floor(Math.sqrt(i*i + j*j)) + 1;
      color = Math.floor(Math.random() * 256 * 256 * 256);
      iso.add(Point(i, 0, j), Shape.Box(1, height, 1), color);
    }
  }

  iso.render();
}

var t = 0;
var r = Math.sqrt(2) * 100;

function animate() {
  requestAnimationFrame(animate);
  t += 0.01;
  var x = r * Math.cos(t - 3*Math.PI/4);
  var z = r * Math.sin(t - 3*Math.PI/4);
  iso.camera.position.set(x, 100, z);
  iso.camera.lookAt({x: 0, y: 10, z: 0});
  iso.render();
}

document.addEventListener('DOMContentLoaded', function () {
  init();
  //animate();
});
