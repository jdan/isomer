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

var Example = {};

Example.brand = function () {
  var iso = new Isomer(document.getElementById("logo"), {
    originX: 470,
    originY: 950
  });

  iso.add(Shape.Prism(new Point(1, -1, 0), 4, 5, 2));
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
}

Example.basic = function () {
  var iso = new Isomer(document.getElementById("basic-example"));
  iso.add(Shape.Prism(Point.ORIGIN));
};

Example.grid = function () {
  var x, y, iso = new Isomer(document.getElementById("grid-example"));

  for (x = 0; x < 10; x++) {
    iso.add(new Path([
      new Point(x, 0, 0),
      new Point(x, 10, 0),
      new Point(x, 0, 0)
    ]), new Color(50, 60, 160));
  }
  for (y = 0; y < 10; y++) {
    iso.add(new Path([
      new Point(0, y, 0),
      new Point(10, y, 0),
      new Point(0, y, 0)
    ]), new Color(50, 60, 160));
  }

  iso.add(Shape.Prism(Point.ORIGIN));

  iso.add(new Path([
    Point.ORIGIN,
    new Point(0, 0, 10),
    Point.ORIGIN
  ]), new Color(160, 50, 60));
}

Example.basic2 = function () {
  var iso = new Isomer(document.getElementById("basic-example-2"));
  iso.add(Shape.Prism(Point.ORIGIN, 2, 1, 3));
};

Example.prism = function () {
  var iso = new Isomer(document.getElementById("prism-example"));

  iso.add([
    Shape.Prism(Point.ORIGIN, 4, 4, 2),
    Shape.Prism(new Point(-1, 1, 0), 1, 2, 1),
    Shape.Prism(new Point(1, -1, 0), 2, 1, 1)
  ]);
};

Example.pyramid = function () {
  var iso = new Isomer(document.getElementById("pyramid-example"));

  iso.add([
    Shape.Prism(Point.ORIGIN, 3, 3, 1),
    Shape.Pyramid(new Point(0, 0, 1)),
    Shape.Pyramid(new Point(0, 2, 1)),
    Shape.Pyramid(new Point(2, 0, 1)),
    Shape.Pyramid(new Point(2, 2, 1))
  ]);
};

Example.color1 = function () {
  var iso = new Isomer(document.getElementById("color-example"));
  var red = new Color(160, 60, 50);
  var blue = new Color(50, 60, 160);

  iso.add(Shape.Prism(Point.ORIGIN, 3, 3, 1));
  iso.add(Shape.Pyramid(Point(0, 2, 1)), red);
  iso.add(Shape.Prism(Point(2, 0, 1)), blue);
};

Example.path = function () {
  var iso = new Isomer(document.getElementById("path-example"));

  iso.add(Shape.Prism(Point.ORIGIN, 3, 3, 1));
  iso.add(new Path([
    Point(1, 1, 1),
    Point(2, 1, 1),
    Point(2, 2, 1),
    Point(1, 2, 1)
  ]), new Color(50, 160, 60));
};

Example.embossPath = function () {
  var iso = new Isomer(document.getElementById("emboss-example"));

  iso.add(Shape.Prism(Point.ORIGIN, 3, 3, 1));
  iso.add(Shape.emboss(new Path([
    Point(1, 1, 1),
    Point(2, 1, 1),
    Point(2, 3, 1)
  ]), 0.3), new Color(50, 160, 60));
};

Example.translateExample = function () {
  var iso = new Isomer(document.getElementById("translate-example"));
  var blue = new Color(50, 60, 160);
  var red = new Color(160, 50, 60);
  var cube = Shape.Prism(Point.ORIGIN);

  iso.add(cube);
  iso.add(cube.translate(0, 0, 1.1), blue);
  iso.add(cube.translate(0, 0, 2.2), red);
};

Example.scaleExample = function () {
  var iso = new Isomer(document.getElementById("scale-example"));
  var blue = new Color(50, 60, 160);
  var cube = Shape.Prism(Point.ORIGIN);
  iso.add(cube.scale(Point.ORIGIN, 3, 3, 0.5));
  iso.add(cube
    .scale(Point.ORIGIN, 3, 3, 0.5)
    .translate(0, 0, 0.6)
  , blue);
};

Example.rotateExample = function () {
  var iso = new Isomer(document.getElementById("rotatez-example"));
  var blue = new Color(50, 60, 160);
  var cube = Shape.Prism(Point.ORIGIN, 3, 3, 1);
  iso.add(cube);
  iso.add(cube
    .rotateZ(Point(1.5, 1.5, 0), Math.PI / 12)
    .translate(0, 0, 1.1)
  , blue);
};

(function () {
  var i;
  for (i in Example) {
    Example[i]();
  }
})();
