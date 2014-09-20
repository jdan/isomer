var iso = new Isomer(document.getElementById("canvas"), { shadows: true });
var Point = Isomer.Point;
var Path = Isomer.Path;
var Shape = Isomer.Shape;

function shoe() {
  var points = [
    Point(0, 0),
    Point(0.3, 0),
    Point(0.3, 2),
    Point(3.3, 0),
    Point(6.3, 0),
    Point(6.3, 1),
    Point(3.3, 3),
    Point(3.3, 4),
    Point(0, 4)
  ];

  return new Path(points);
}

function L() {
  return new Path([
    Point.ORIGIN,
    Point(1, 0),
    Point(1, 2),
    Point(2, 2),
    Point(2, 3),
    Point(0, 3)
  ]);
}

document.addEventListener('DOMContentLoaded', function () {
  var shoe3D = Shape.Extrude(shoe(), 1).rotateY(Math.PI);
  var L3D = Shape.Extrude(L(), 1);
  iso.add(L3D, Point(5, 0, 1), 0xFFDD22);
  iso.add(shoe3D, Point(6, 0, 5), 0x22DDFF);
  iso.add(Shape.Box(100, 0.1, 100), Point(-50, -0.1, -50), 0xFFFFFF);
  iso.render();
});
