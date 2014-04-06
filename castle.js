/**
 * Draws a castle!
 */

var canvas = new Canvas(document.getElementById("canvas"));
var iso = new Isometric(canvas);

function stairs(origin, rotation) {
  var STEP_COUNT = 10;

  function rotatePath(path) {
    var center = origin.translate(0.5, 0.5, 0);

    if (!rotation) {
      return path;
    } else {
      return path.map(function (point) {
        return point.rotateZ(center, rotation);
      });
    }
  }

  /* Create a zig-zag */
  var zigzag = [origin];
  var steps = [], i;

  for (i = 0; i < STEP_COUNT; i++) {
    /**
     *  2
     * __
     *   | 1
     */

    var stepCorner = origin.translate(0, i / STEP_COUNT, (i + 1) / STEP_COUNT);
    /* Draw two planes */
    steps.push([
      stepCorner,
      stepCorner.translate(0, 0, -1 / STEP_COUNT),
      stepCorner.translate(1, 0, -1 / STEP_COUNT),
      stepCorner.translate(1, 0, 0)
    ]);

    steps.push([
      stepCorner,
      stepCorner.translate(1, 0, 0),
      stepCorner.translate(1, 1 / STEP_COUNT, 0),
      stepCorner.translate(0, 1 / STEP_COUNT, 0)
    ]);

    zigzag.push(stepCorner);
    zigzag.push(stepCorner.translate(0, 1 / STEP_COUNT, 0));
  }

  zigzag.push(origin.translate(0, 1, 0));

  iso.path(rotatePath(zigzag));
  iso.path(rotatePath(zigzag.reverse().map(function (point) {
    return point.translate(1, 0, 0);
  })));

  for (i = 0; i < steps.length; i++) {
    iso.path(rotatePath(steps[i]));
  }

}

iso.prism(new Point(1, 0, 0), 4, 4, 2);
iso.prism(new Point(0, 0, 0), 1, 4, 1);
iso.prism(new Point(-1, 1, 0), 1, 3, 1);
stairs(new Point(-1, 0, 0));
stairs(new Point(0, 3, 1), -Math.PI / 2);
iso.prism(new Point(3, 0, 2), 2, 4, 1);
iso.prism(new Point(2, 1, 2), 1, 3, 1);
stairs(new Point(2, 0, 2), -Math.PI / 2);

iso.pyramid(new Point(2, 3, 3), 1, 1, 1, new Color(180, 180, 0));
iso.pyramid(new Point(4, 3, 3), 1, 1, 1, new Color(180, 0, 180));
iso.pyramid(new Point(4, 0, 3), 1, 1, 1, new Color(0, 180, 180));
