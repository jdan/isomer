var iso = new Isomer(document.getElementById("logo"), {
  scale: 25,
  originX: 370,
  originY: 930
});
var Shape = Isomer.Shape;
var Color = Isomer.Color;
var Point = Isomer.Point;
var Path = Isomer.Path;

var brick = new Color(180, 180, 180);
var i;

var base = Shape.Prism(Point.ORIGIN, 20, 10, 3);
iso.add(base, brick);
iso.add(Stairs(Point(0, -1, 0), 7).scale(Point.ORIGIN, 20, 3, 3), brick);
iso.add(Stairs(Point(-1, -1, 0), 7)
          .rotateZ(Point.ORIGIN, -Math.PI/2)
          .scale(Point.ORIGIN, 3, 10, 3), brick);

for (i = 0; i < 11; i++) {
  iso.add(Shape.Prism(Point(1.9*i + 0.2, 0.2, 3), 0.6, 0.6, 0.1), brick);
  iso.add(Shape.Prism(Point(1.9*i + 0.2, 9.2, 3), 0.6, 0.6, 0.1), brick);

  iso.add(Shape.Cylinder(Point(1.9*i + 0.5, 0.5, 3.1), 0.25, 10, 4), brick);
  iso.add(Shape.Cylinder(Point(1.9*i + 0.5, 9.5, 3.1), 0.25, 10, 4), brick);
}

var roof = Stairs(Point(0, 0, 7.1), 7).scale(Point(0, 0, 7.1), 20, 5, 3);

iso.add(roof.rotateZ(Point(10, 5, 7.1), Math.PI), brick);
iso.add(roof, brick);




function Stairs(origin, stepCount) {
  stepCount = stepCount || 10;

  /* Create a zig-zag */
  var zigzag = new Path(origin);
  var steps = [], i;

  /* Shape to return */
  var stairs = new Shape();

  for (i = 0; i < stepCount; i++) {
    /**
     *  2
     * __
     *   | 1
     */

    var stepCorner = origin.translate(0, i / stepCount, (i + 1) / stepCount);
    /* Draw two planes */
    steps.push(new Path([
      stepCorner,
      stepCorner.translate(0, 0, -1 / stepCount),
      stepCorner.translate(1, 0, -1 / stepCount),
      stepCorner.translate(1, 0, 0)
    ]));

    steps.push(new Path([
      stepCorner,
      stepCorner.translate(1, 0, 0),
      stepCorner.translate(1, 1 / stepCount, 0),
      stepCorner.translate(0, 1 / stepCount, 0)
    ]));

    zigzag.push(stepCorner);
    zigzag.push(stepCorner.translate(0, 1 / stepCount, 0));
  }

  zigzag.push(origin.translate(0, 1, 0));


  for (i = 0; i < steps.length; i++) {
    stairs.push(steps[i]);
  }
  stairs.push(zigzag);
  stairs.push(zigzag.reverse().translate(1, 0, 0));

  return stairs;
}
