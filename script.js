var canvas = new Canvas(document.getElementById("canvas"));
var iso = new Isometric(canvas);

var x, y, color;

function randomColor() {
  return 'rgb(' + [
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256)
  ].join(',') + ')';
}

iso.prism(new Point(0, 2, 0), 1, 1, 3);
iso.prism(new Point(0, 1, 0), 1, 1, 2);
iso.prism(new Point(0, 0, 0), 1, 1, 1);

iso.prism(new Point(3, 0, 0), 3, 3, 1);
iso.pyramid(new Point(3, 0, 1), 1, 1, 1.2);
iso.pyramid(new Point(5, 0, 1), 1, 1, 1.2);
iso.pyramid(new Point(5, 2, 1), 1, 1, 1.2);
iso.pyramid(new Point(3, 2, 1), 1, 1, 1.2);


/*
for (x = 8; x >= 0; x--) {
  for (y = 8; y >= 0; y--) {
    if (x == 8 && y == 8) continue;
    iso.pyramid(new Point(x, y), 1, 1, Math.floor(Math.random() * 2) + 1);
  }
}
*/

