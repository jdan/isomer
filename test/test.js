var iso = new Isomer(document.getElementById("canvas"));
var Point = Isomer.Point;
var Path = Isomer.Path;
var Shape = Isomer.Shape;
var Color = Isomer.Color;

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
    //iso.add(Shape.Extrude(I, 1), Point(2, 0, 4), 0x66FF88);
    iso.add(Shape.Extrude(I, 1), Point(2, 0, 4), Color(102, 255, 136));
    iso.render();
});
