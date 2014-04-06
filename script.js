/**
 * Draws a castle!
 */

var iso = new Isomer(document.getElementById("canvas"));
var Point = Isomer.Point;
var Path = Isomer.Path;
var Shape = Isomer.Shape;
var Color = Isomer.Color;

function Stairs(origin) {
  var STEP_COUNT = 10;

  /* Create a zig-zag */
  var zigzag = new Path(origin);
  var steps = [], i;

  /* Shape to return */
  var stairs = new Shape();

  for (i = 0; i < STEP_COUNT; i++) {
    /**
     *  2
     * __
     *   | 1
     */

    var stepCorner = origin.translate(0, i / STEP_COUNT, (i + 1) / STEP_COUNT);
    /* Draw two planes */
    steps.push(new Path([
      stepCorner,
      stepCorner.translate(0, 0, -1 / STEP_COUNT),
      stepCorner.translate(1, 0, -1 / STEP_COUNT),
      stepCorner.translate(1, 0, 0)
    ]));

    steps.push(new Path([
      stepCorner,
      stepCorner.translate(1, 0, 0),
      stepCorner.translate(1, 1 / STEP_COUNT, 0),
      stepCorner.translate(0, 1 / STEP_COUNT, 0)
    ]));

    zigzag.push(stepCorner);
    zigzag.push(stepCorner.translate(0, 1 / STEP_COUNT, 0));
  }

  zigzag.push(origin.translate(0, 1, 0));

  stairs.push(zigzag);
  stairs.push(zigzag.reverse().translate(1, 0, 0));

  for (i = 0; i < steps.length; i++) {
    stairs.push(steps[i]);
  }

  return stairs;
}

iso.add(Shape.Prism(new Point(1, 0, 0), 4, 4, 2));
iso.add(Shape.Prism(new Point(0, 0, 0), 1, 4, 1));
iso.add(Shape.Prism(new Point(-1, 1, 0), 1, 3, 1));

iso.add(Stairs(new Point(-1, 0, 0)));
iso.add(Stairs(new Point(0, 3, 1)).rotateZ(-Math.PI / 2, new Point(0.5, 3.5, 1)));

iso.add(Shape.Prism(new Point(3, 0, 2), 2, 4, 1));
iso.add(Shape.Prism(new Point(2, 1, 2), 1, 3, 1));

iso.add(Stairs(new Point(2, 0, 2)).rotateZ(-Math.PI / 2, new Point(2.5, 0.5, 0)));

iso.add(Shape.Pyramid(new Point(2, 3, 3), 1, 1, 1), new Color(180, 180, 0));
iso.add(Shape.Pyramid(new Point(4, 3, 3), 1, 1, 1), new Color(180, 0, 180));
iso.add(Shape.Pyramid(new Point(4, 0, 3), 1, 1, 1), new Color(0, 180, 180));;
