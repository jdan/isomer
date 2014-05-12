![isomer](https://i.cloudup.com/kQrnH2x5XE-3000x3000.png)

### An isometric graphics library for HTML5 canvas

View the [official project page](http://jdan.github.io/isomer/) or [try it out](http://codepen.io/jdan/pen/HmGCz/left/?editors=001).

## About

[Isomer](http://jdan.github.io/isomer/) is an easy-to-use graphics library for drawing isometric scenes.

```javascript
var Shape = Isomer.Shape;
var Point = Isomer.Point;
var Color = Isomer.Color;
var red = new Color(160, 60, 50);
var blue = new Color(50, 60, 160);

iso.add(Shape.Prism(Point.ORIGIN, 3, 3, 1));
iso.add(Shape.Pyramid(Point(0, 2, 1)), red);
iso.add(Shape.Prism(Point(2, 0, 1)), blue);
```

![output](https://i.cloudup.com/V_jJ8lRpZV-300x300.png)

## Getting Started

First, grab a copy of Isomer [here](https://github.com/jdan/isomer/releases/latest). You can also [pay for it](https://gumroad.com/l/Xzlg). Then, include the script wherever you see fit:

```html
<script src="/path/to/isomer.min.js"></script>
```

After which you'll need to place a canvas in your document that we can later refer to. Be sure to give it a width and height.

```html
<canvas width="800" height="600" id="art"></canvas>
```

**Note (Optional):** To improve the look of your canvas on retina displays, declare the width and height of your canvas element as double how you want it to appear. Then style your canvas with CSS to include the original dimensions.

```css
#art {
  width: 400px;
  height: 300px;
}
```

At this point we can finally instantiate an Isomer object. Pass it a reference to your canvas like so:

```javascript
var iso = new Isomer(document.getElementById("art"));
```

Now you're ready to start drawing!

## Build

Isomer uses [Gulp](http://gulpjs.com/) as a build tool. To build the project,
first install the dependencies.

```
$ npm install
```

Then run `npm run dist`:

```
$ npm run dist    # or, alternatively, `gulp dist`

> isomer@0.2.4 dist /Users/jordan/Projects/isomer
> gulp

[gulp] Using gulpfile ~/Projects/isomer/gulpfile.js
[gulp] Starting 'dist'...
[gulp] Finished 'dist' after 8.35 ms
[gulp] Starting 'default'...
[gulp] Finished 'default' after 6.52 μs
```

To generate `isomer.js` and `isomer.min.js` in the `dist/` directory.

## Develop

Isomer is developed using [Browserify](http://browserify.org/). Install
dependencies and build the project like so:

```
$ npm install
$ npm run dist
```

[test/index.html](https://github.com/jdan/isomer/blob/master/test/index.html) contains a basic testing page that draws various shapes. This page will load the unminified bundle.

The `test` script (accessible via `npm test`) uses [beefy](https://github.com/chrisdickinson/beefy) to automatically rebuild Isomer on any file changes. This script also opens the testing page (located at `http://localhost:9966/test/`) in your default browser. The testing page includes a live reload script to refresh when Isomer is rebuilt.

```
$ npm test

> isomer@0.2.4 test /Users/jordan/Projects/isomer
> open http://localhost:9966/test/ && ./node_modules/.bin/beefy index.js:dist/isomer.js --live -- --standalone Isomer

listening on http://localhost:9966/
200   30ms    1.18KB /test/
200    8ms      508B /test/style.css
200    1ms    5.48KB /test/test.js
200  704ms    48.5KB /dist/isomer.js -> ./node_modules/.bin/browserify ./index.js --standalone Isomer -d
```

## With node-canvas

Isomer also accepts the canvas provided by [node-canvas](https://github.com/learnboost/node-canvas),
meaning you can generate isometric graphics on the command line.

```javascript
var Canvas = require('canvas');
var canvas = new Canvas(400, 400);
var Isomer = require('isomer');   // npm install isomer
var fs = require('fs');
var out = fs.createWriteStream('output.png');

var iso = new Isomer(canvas);
iso.add(Isomer.Shape.Prism(Isomer.Point.ORIGIN));

canvas.pngStream().pipe(out);
```

## More Info

For more info, check out the [official project page](http://jdan.github.io/isomer).

[MIT Licensed](https://github.com/jdan/isomer/blob/master/LICENSE)
