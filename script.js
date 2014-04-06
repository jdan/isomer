var canvas = new Canvas(document.getElementById("canvas"));
var iso = new Isometric(canvas);

var x, y, color;

function randomColor() {
  return new Color(
    Math.floor(Math.random() * 200 + 30),
    Math.floor(Math.random() * 200 + 30),
    Math.floor(Math.random() * 200 + 30));
}

/*
var red = new Color(180, 40, 30);
var blue = new Color(20, 20, 200);

iso.prism(new Point(0, 2, 0), 1, 1, 3, red);
iso.prism(new Point(0, 1, 0), 1, 1, 2, red);
iso.prism(new Point(0, 0, 0), 1, 1, 1, red);

iso.prism(new Point(3, 0, 0), 3, 3, 1);
iso.pyramid(new Point(3, 0, 1), 1, 1, 1.2, blue);
iso.pyramid(new Point(5, 0, 1), 1, 1, 1.2, blue);
iso.pyramid(new Point(5, 2, 1), 1, 1, 1.2, blue);
iso.pyramid(new Point(3, 2, 1), 1, 1, 1.2, blue);
*/

/*
for (x = 8; x >= 0; x--) {
  for (y = 8; y >= 0; y--) {
    if (x == 8 && y == 8) continue;
    iso.prism(new Point(x, y), 1, 1, 1 + parseInt(Math.sqrt(x*x + y*y)), randomColor());
  }
}
*/

