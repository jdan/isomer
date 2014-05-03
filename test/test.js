/**
 * Draws a castle!
 */

var iso = new Isomer(document.getElementById("canvas"));
var Point = Isomer.Point;
var Path = Isomer.Path;
var Shape = Isomer.Shape;
var Color = Isomer.Color;

function TestSuite() {}

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

function randomColor() {
  return new Color(
    parseInt(Math.random() * 256),
    parseInt(Math.random() * 256),
    parseInt(Math.random() * 256));
}

TestSuite['draw structure'] = function () {
  iso.add(Shape.Prism(new Point(1, 0, 0), 4, 4, 2));
  iso.add(Shape.Prism(new Point(0, 0, 0), 1, 4, 1));
  iso.add(Shape.Prism(new Point(-1, 1, 0), 1, 3, 1));

  iso.add(Stairs(new Point(-1, 0, 0)));
  iso.add(Stairs(new Point(0, 3, 1)).rotateZ(new Point(0.5, 3.5, 1), -Math.PI / 2));

  iso.add(Shape.Prism(new Point(3, 0, 2), 2, 4, 1));
  iso.add(Shape.Prism(new Point(2, 1, 2), 1, 3, 1));

  iso.add(Stairs(new Point(2, 0, 2)).rotateZ(new Point(2.5, 0.5, 0), -Math.PI / 2));

  iso.add(Shape.Pyramid(new Point(2, 3, 3))
    .scale(new Point(2, 4, 3), 0.5),
    new Color(180, 180, 0));
  iso.add(Shape.Pyramid(new Point(4, 3, 3))
    .scale(new Point(5, 4, 3), 0.5),
    new Color(180, 0, 180));
  iso.add(Shape.Pyramid(new Point(4, 1, 3))
    .scale(new Point(5, 1, 3), 0.5),
    new Color(0, 180, 180));
  iso.add(Shape.Pyramid(new Point(2, 1, 3))
    .scale(new Point(2, 1, 3), 0.5),
    new Color(40, 180, 40));

  iso.add(Shape.Prism(new Point(3, 2, 3), 1, 1, 0.2), new Color(50, 50, 50));
  iso.add(Knot(new Point(3, 2, 3.2)), new Color(0, 180, 180));;
};

TestSuite['test scales'] = function () {
  var cube = Shape.Prism(new Point(5, 5), 1, 1, 1);

  for (var i = 0; i < 20; i++) {
    iso.add(cube
      .scale(new Point(5.5, 5.5), 10 - i/2, 10 - i/2, 1/3)
      .translate(0, 0, i/3)
      .rotateZ(new Point(5.5, 5.5), -Math.PI/20 * i),
           randomColor());
  }
};

TestSuite['test extrude'] = function () {
  var s = Shape.extrude(new Path([
    Point(1, 1, 1),
    Point(2, 1, 1),
    Point(2, 3, 1)
  ]), 0.3).scale(Point.ORIGIN, 5);

  iso.add(s, new Color(50, 160, 60));
};

TestSuite['test cylinder'] = function () {
  iso.add(Shape.Cylinder(new Point(8, 8, 0), 6));
  iso.add(Shape.Cylinder(new Point(11, 11, 1), 2.5, 20, 6), randomColor());
  iso.add(Shape.Cylinder(new Point(5, 9, 1), 0.75, 20, 12), randomColor());
  iso.add(Shape.Cylinder(new Point(4.5, 8, 1), 1.5, 20, 3), randomColor());
  iso.add(Shape.Cylinder(new Point(10, 6, 1), 2.5, 20, 5), randomColor());
  iso.add(Shape.Cylinder(new Point(6, 5, 1), 2, 20, 4), randomColor());
};

TestSuite['test star'] = function () {
  iso.add(Shape.extrude(Path.Star(Point.ORIGIN, 1, 2, 4).rotateZ(Point.ORIGIN, Math.PI/6)));
};

TestSuite['draw logo'] = function () {
  iso.add(Shape.Prism(new Point(1, 1), 1, 1, 2), new Color(0, 180, 180));
  iso.add(Shape.Prism(new Point(0, 1), 1, 1, 1.5), new Color(50, 60, 180));
  iso.add(Shape.Prism(new Point(1, 0), 1, 1, 1), new Color(50, 180, 60));
  iso.add(Shape.Prism(new Point(0, 0), 1, 1, 0.5), new Color(180, 50, 60));
};

TestSuite['red light'] = function () {
  iso.lightColor = new Color(160, 50, 60);
  iso.add(Shape.Prism(new Point(1, 1), 1, 1, 2), new Color(0, 180, 180));
  iso.add(Shape.Prism(new Point(0, 1), 1, 1, 1.5), new Color(50, 60, 180));
  iso.add(Shape.Prism(new Point(1, 0), 1, 1, 1), new Color(50, 180, 60));
  iso.add(Shape.Prism(new Point(0, 0), 1, 1, 0.5), new Color(180, 50, 60));
  iso.lightColor = new Color(255, 255, 255);
};


/**
 * Add testing buttons
 */
(function () {
  var fn;
  var panel = document.getElementById("control");
  var button;

  for (fn in TestSuite) {
    button = document.createElement("div");
    button.classList.add("test-btn");
    button.innerHTML = fn;
    button.onclick = (function (fn) {
      return function () {
        /* Clear the canvas and execute the test function */
        iso.canvas.clear();
        fn();
      };
    })(TestSuite[fn]);

    panel.appendChild(button);
  }
})();
