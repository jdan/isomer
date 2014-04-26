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

To start using Isomer, you first need to include a small (7kb minified) script wherever you see fit:

```html
<script src="/path/to/isomer.min.js"></script>
```

After which you'll need to place a canvas in your document that we can later refer to. Be sure to give it a width and height!

```html
<canvas width="800" height="600" id="art"></canvas>
```

**Note:** To improve the look of your canvas on retina displays, declare the width and height of your canvas element as double how you want it to appear. Then style your canvas with CSS to include the original dimensions.

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

And you're ready to start drawing!

## Build

To build the project, first install [gulp](http://gulpjs.com/).

```
$ npm install -g gulp
```

And then simply run:

```
$ gulp
[gulp] Using gulpfile /Users/jordan/Projects/isomer/gulpfile.js
[gulp] Starting 'build'...
[gulp] Finished 'build' after 6.47 ms
[gulp] Starting 'default'...
[gulp] Finished 'default' after 17 μs
```

To generate `isomer.min.js` in the `build/` directory.

## Develop

Install dependencies with:

```
$ npm install
```

[test/index.html](https://github.com/jdan/isomer/blob/master/test/index.html) contains a basic testing page that draws various shapes. This page will load the unminified scripts.

## More Info

For more info, check out the [official project page](http://jdan.github.io/isomer).

[MIT Licensed](https://github.com/jdan/isomer/blob/master/LICENSE)
