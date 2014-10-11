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

var U = new Path([
  Point(0, 0),
  Point(4, 0),
  Point(4, 4),
  Point(3, 4),
  Point(3, 1),
  Point(1, 1),
  Point(1, 4),
  Point(0, 4)
]);

var N = new Path([
  Point(0, 0),
  Point(1, 0),
  Point(3, 3),
  Point(3, 0),
  Point(4, 0),
  Point(4, 4),
  Point(3, 4),
  Point(1, 1),
  Point(1, 4),
  Point(0, 4)
]);

var I = new Path([
  Point(0, 0),
  Point(1, 0),
  Point(1, 4),
  Point(0, 4)
]);

var T = new Path([
  Point(1, 0),
  Point(2, 0),
  Point(2, 3),
  Point(3, 3),
  Point(3, 4),
  Point(0, 4),
  Point(0, 3),
  Point(1, 3)
]);

document.addEventListener('DOMContentLoaded', function () {
  iso.add(Shape.Box(100, 0.1, 100), Point(-50, -0.1, -50), 0xFFFFFF);
  iso.add(Shape.Extrude(U, 1), Point(8, 0, -4), 0xFFDD44);
  iso.add(N, Point(4, 0, 0), 0x6688FF);
  iso.add(Shape.Extrude(I, 1), Point(2, 0, 4), 0x66FF88);
  iso.add(Shape.Extrude(T, 1), Point(-3, 0, 7), 0xFF6688);
  iso.render();
});
