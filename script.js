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


  for (i = 0; i < steps.length; i++) {
    stairs.push(steps[i]);
  }
  stairs.push(zigzag);
  stairs.push(zigzag.reverse().translate(1, 0, 0));

  return stairs;
}

function Knot(origin) {
  var knot = new Shape();

  knot.paths = knot.paths.concat(Shape.Prism(Point.ORIGIN, 5, 1, 1).paths);
  knot.paths = knot.paths.concat(Shape.Prism(new Point(4, 1, 0), 1, 4, 1).paths);
  knot.paths = knot.paths.concat(Shape.Prism(new Point(4, 4, -2), 1, 1, 3).paths);

  knot.push(new Path([
    new Point(0, 0, 2),
    new Point(0, 0, 1),
    new Point(1, 0, 1),
    new Point(1, 0, 2)
  ]));

  knot.push(new Path([
    new Point(0, 0, 2),
    new Point(0, 1, 2),
    new Point(0, 1, 1),
    new Point(0, 0, 1)
  ]));

  return knot.scale(Point.ORIGIN, 1/5).translate(-0.1, 0.15, 0.4).translate(origin.x, origin.y, origin.z);
}

function drawStructure() {
  iso.add(Shape.Prism(new Point(1, 0, 0), 4, 4, 2));
  iso.add(Shape.Prism(new Point(0, 0, 0), 1, 4, 1));
  iso.add(Shape.Prism(new Point(-1, 1, 0), 1, 3, 1));

  iso.add(Stairs(new Point(-1, 0, 0)));
  iso.add(Stairs(new Point(0, 3, 1)).rotateZ(new Point(0.5, 3.5, 1), -Math.PI / 2));

  iso.add(Shape.Prism(new Point(3, 0, 2), 2, 4, 1));
  iso.add(Shape.Prism(new Point(2, 1, 2), 1, 3, 1));

  iso.add(Stairs(new Point(2, 0, 2)).rotateZ(new Point(2.5, 0.5, 0), -Math.PI / 2));

  iso.add(Knot(new Point(2, 3, 3)), new Color(180, 180, 0));
  iso.add(Knot(new Point(4, 3, 3)), new Color(180, 0, 180));
  iso.add(Knot(new Point(4, 0, 3)), new Color(0, 180, 180));;
}

function testScales() {
  var cube = Shape.Prism(new Point(5, 5), 1, 1, 1);

  for (var i = 0; i < 20; i++) {
    iso.add(cube
      .scale(new Point(5.5, 5.5), 10 - i/2, 10 - i/2, 1/3)
      .translate(0, 0, i/5)
      .rotateZ(new Point(5.5, 5.5), -Math.PI/20 * i),
           new Color(parseInt(Math.random() * 256), parseInt(Math.random() * 256), parseInt(Math.random() * 256)));
  }
}

function testEmboss() {
  var basePath = new Path([
    new Point(0, 0, 0),
    new Point(1, 0, 0),
    new Point(1.5, 0.5, 0),
    new Point(1, 1, 0),
    new Point(0, 1, 0)
  ]);

  iso.add(Shape.embossPath(basePath)
      .rotateZ(Point.ORIGIN, 5*Math.PI/6)
      .scale(Point.ORIGIN, 4)
      .translate(6, 6, 0));
}

function testCircle() {
  iso.add(Shape.embossPath(Path.Circle(new Point(5, 5, 0), 1, 8)));
}

//drawStructure();
//testScales();
//testEmboss();
testCircle();
