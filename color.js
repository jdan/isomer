/**
 * A color with RGB between 0-255
 */
function Color(r, g, b) {
  this.r = parseInt(r);
  this.g = parseInt(g);
  this.b = parseInt(b);
};

Color.prototype.toHex = function () {
  // Pad with 0s
  return '#' + (this.r * 256 * 256 + this.g * 256 + this.b).toString(16);
};

/**
 * Computes the luminosity of a color
 * 0.21 R + 0.71 G + 0.07 B
 */
Color.prototype.luminosity = function () {
  return 0.21 * this.r / 255 + 0.71 * this.g / 255 + 0.07 * this.b / 255;
};

