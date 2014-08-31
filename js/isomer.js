var Canvas = require('./canvas');
var Color = require('./color');
var Path = require('./path');
var Point = require('./point');
var Shape = require('./shape');
var Vector = require('./vector');


/**
 * The Isomer class
 *
 * This file contains the Isomer base definition
 */
function Isomer(canvasId, options) {
  options = options || {};

  this.canvas = new Canvas(canvasId);
  this.angle = Math.PI / 6;

  this.scale = options.scale || 70;

  this._calculateTransformation();

  this.originX = options.originX || this.canvas.width / 2;
  this.originY = options.originY || this.canvas.height * 0.9;

  /**
   * Light source as defined as the angle from
   * the object to the source.
   *
   * We'll define somewhat arbitrarily for now.
   */
  this.lightPosition = options.lightPosition || new Vector(2, -1, 3);
  this.lightAngle = this.lightPosition.normalize();

  /**
   * The maximum color difference from shading
   */
  this.colorDifference = 0.20;
  this.lightColor = options.lightColor || new Color(255, 255, 255);

  /**
   * List of {path, color, shapeName} to draw
   */
  this.paths = [];
}

/**
 * Sets the light position for drawing.
 */
Isomer.prototype.setLightPosition = function (x, y, z) {
  this.lightPosition = new Vector(x, y, z);
  this.lightAngle = this.lightPosition.normalize();
}

Isomer.prototype._translatePoint = function (point) {
  /**
   * X rides along the angle extended from the origin
   * Y rides perpendicular to this angle (in isometric view: PI - angle)
   * Z affects the y coordinate of the drawn point
   */
  var xMap = new Point(point.x * this.transformation[0][0],
                       point.x * this.transformation[0][1]);

  var yMap = new Point(point.y * this.transformation[1][0],
                       point.y * this.transformation[1][1]);

  var x = this.originX + xMap.x + yMap.x;
  var y = this.originY - xMap.y - yMap.y - (point.z * this.scale);
  return new Point(x, y);
};


/**
 * Adds a shape or path to the scene
 *
 * This method also accepts arrays.
 * By default or if expertMode=0, shapes are drawn
 */
Isomer.prototype.add = function (item, baseColor, expertMode, name) {
  var expertModeValid = !!expertMode;
  if (Object.prototype.toString.call(item) == '[object Array]') {
    for (var i = 0; i < item.length; i++) {
      this.add(item[i], baseColor, expertModeValid, name);
    }
  } else if (item instanceof Path) {
    if(expertModeValid){
      this.paths[this.paths.length] = {path:item, color:baseColor, shapeName:(name||'')};
    } else {
      this._addPath(item, baseColor);
    }
  } else if (item instanceof Shape) {
    var paths = item.orderedPaths();
    for (var i in paths) {
      if(expertModeValid){
        this.paths[this.paths.length] = {path:paths[i], color:baseColor, shapeName:(name||'')};
      } else {
	this._addPath(paths[i], baseColor);
      }
    }
  }
};

/**
 * Draws the content of this.paths
 * By default, does not sort the paths between shapes
 */
Isomer.prototype.draw = function(sortPath){
  var sortValid = !!sortPath;
  if(sortValid){
    this.sortPaths();
  }
  for (var i in this.paths){
    this._addPath(this.paths[i].path, this.paths[i].color);
  }
}


/**
 * Sorts the paths contained in this.paths,
 * ordered so that distant faces are displayed first
 *  */
Isomer.prototype.sortPaths = function () {
  var Point = Isomer.Point;
  var observer = new Point(-10, -10, 20);
  var pathList = [];
  for (var i = 0; i < this.paths.length; i++) {
    var currentPath = this.paths[i];
    pathList[i] = {
      path: currentPath.path,
      polygon: currentPath.path.points.map(this._translatePoint.bind(this)),
      color: currentPath.color,
      drawn: 0,
      shapeName: currentPath.shapeName

    };
  }
 this.paths.length = 0;

 // topological sort
  
  var drawBefore = [];
  for (var i = 0 ; i < pathList.length ; i++){
	drawBefore[i] = [];
  }
  for (var i = 0 ; i < pathList.length ; i++){
    for (var j = 0 ; j < i ; j++){
	  if(this._hasIntersection(pathList[i].polygon, pathList[j].polygon)){
	    var cmpPath = pathList[i].path.closerThan(pathList[j].path, observer);
	    if(cmpPath < 0){
	      drawBefore[i][drawBefore[i].length] = j;
	    }
	    if(cmpPath > 0){
	      drawBefore[j][drawBefore[j].length] = i;
	    }
	  }
	}
  }
  var drawThisTurn = 1;
  var index = 0;
  while(drawThisTurn == 1){
	index++;
	drawThisTurn = 0;
	for (var i = 0 ; i < pathList.length ; i++){
	  if(pathList[i].drawn == 0){
	    var canDraw = 1;
		for (var j = 0 ; j < drawBefore[i].length ; j++){
		  if(pathList[drawBefore[i][j]].drawn == 0){canDraw = 0;}
		}
		if(canDraw == 1){
		   this.add(pathList[i].path, pathList[i].color, true, pathList[i].shapeName);
		   drawThisTurn = 1;
		   pathList[i].drawn = 1;
		}
	  }
	}
  }
  //purge 
  //could be done more in a smarter order, that's why drawn is is an element of pathList[] and not a separate array
  for (var i = 0 ; i < pathList.length ; i++){
    if(pathList[i].drawn == 0){
      this.add(pathList[i].path, pathList[i].color, true, pathList[i].shapeName);
    }
  }
};


//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/math/is-point-in-poly [rev. #0]
//see also http://jsperf.com/ispointinpath-boundary-test-speed/2
function isPointInPoly(poly, pt){
    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
        && (c = !c);
    return c;
}


/**
 * Does polygonA has intersection with polygonB ?
 * Naive approach done first : approximate the polygons with a rectangle
 * Then more complex method : see if edges cross, or one contained in the other
 */
Isomer.prototype._hasIntersection = function(pointsA, pointsB) {
  var i, j;
  var AminX = pointsA[0].x;
  var AminY = pointsA[0].y;
  var AmaxX = AminX;
  var AmaxY = AminY;
  var BminX = pointsB[0].x;
  var BminY = pointsB[0].y;
  var BmaxX = BminX;
  var BmaxY = BminY;
  for(i = 0 ; i < pointsA.length ; i++){
    AminX = Math.min(AminX, pointsA[i].x);
    AminY = Math.min(AminY, pointsA[i].y);
	AmaxX = Math.max(AmaxX, pointsA[i].x);
    AmaxY = Math.max(AmaxY, pointsA[i].y);
  }
  for(i = 0 ; i < pointsB.length ; i++){
    BminX = Math.min(BminX, pointsB[i].x);
    BminY = Math.min(BminY, pointsB[i].y);
	BmaxX = Math.max(BmaxX, pointsB[i].x);
    BmaxY = Math.max(BmaxY, pointsB[i].y);
  }
  
  if(((AminX <= BminX && BminX <= AmaxX) || (BminX <= AminX && AminX <= BmaxX)) && 
     ((AminY <= BminY && BminY <= AmaxY) || (BminY <= AminY && AminY <= BmaxY))) {
    // now let's be more specific
	var polyA = pointsA.slice();
	var polyB = pointsB.slice();
	polyA.push(pointsA[0]);
	polyB.push(pointsB[0]);

	// see if edges cross, or one contained in the other	
	var deltaAX = [];
	var deltaAY = [];
	var deltaBX = [];
	var deltaBY = [];
	var rA = [];
	var rB = [];
	for(i = 0 ; i <= polyA.length - 2 ; i++){
	  deltaAX[i] = polyA[i+1].x - polyA[i].x;
	  deltaAY[i] = polyA[i+1].y - polyA[i].y;
	  //equation written as deltaY.x - deltaX.y + r = 0
	  rA[i] = deltaAX[i] * polyA[i].y - deltaAY[i] * polyA[i].x;
	}
	for(i = 0 ; i <= polyB.length - 2 ; i++){
	  deltaBX[i] = polyB[i+1].x - polyB[i].x;
	  deltaBY[i] = polyB[i+1].y - polyB[i].y;
	  rB[i] = deltaBX[i] * polyB[i].y - deltaBY[i] * polyB[i].x;
	}
	
	for(i = 0 ; i <= polyA.length - 2 ; i++){
	  for(j = 0 ; j <= polyB.length - 2 ; j++){
	    if(deltaAX[i] * deltaBY[j] != deltaAY[i] * deltaBX[j]){
		  //case when vectors are colinear, or one polygon included in the other, is covered after
		  //two segments cross each other if and only if the points of the first are on each side of the line defined by the second and vice-versa
		  if((deltaAY[i] * polyB[j].x - deltaAX[i] * polyB[j].y + rA[i]) * (deltaAY[i] * polyB[j+1].x - deltaAX[i] * polyB[j+1].y + rA[i]) < -0.000000001 &&  
		     (deltaBY[j] * polyA[i].x - deltaBX[j] * polyA[i].y + rB[j]) * (deltaBY[j] * polyA[i+1].x - deltaBX[j] * polyA[i+1].y + rB[j]) < -0.000000001){
			   return true;
		  }
		}
	  }
	}
	
	for(i = 0 ; i <= polyA.length - 2 ; i++){
	  if(isPointInPoly(polyB, {x:polyA[i].x, y:polyA[i].y})){
	    return true;
	  }
	}
	for(i = 0 ; i <= polyB.length - 2 ; i++){
	  if(isPointInPoly(polyA, {x:polyB[i].x, y:polyB[i].y})){
	    return true;
	  }
	}
	
	return false;
  } else {
    return false;
  }

};

/**
 * Adds a path to the scene
 */
Isomer.prototype._addPath = function (path, baseColor) {
  /* Default baseColor */
  baseColor = baseColor || new Color(120, 120, 120);

  /* Compute color */
  var v1 = Vector.fromTwoPoints(path.points[1], path.points[0]);
  var v2 = Vector.fromTwoPoints(path.points[2], path.points[1]);

  var normal = Vector.crossProduct(v1, v2).normalize();

  /**
   * Brightness is between -1 and 1 and is computed based
   * on the dot product between the light source vector and normal.
   */
  var brightness = Vector.dotProduct(normal, this.lightAngle);
  color = baseColor.lighten(brightness * this.colorDifference, this.lightColor);

  this.canvas.path(path.points.map(this._translatePoint.bind(this)), color);
};

/**
 * Precalculates transformation values based on the current angle and scale
 * which in theory reduces costly cos and sin calls
 */
Isomer.prototype._calculateTransformation = function () {
  this.transformation = [
    [
      this.scale * Math.cos(this.angle),
      this.scale * Math.sin(this.angle)
    ],
    [
      this.scale * Math.cos(Math.PI - this.angle),
      this.scale * Math.sin(Math.PI - this.angle)
    ]
  ];
}

/* Namespace our primitives */
Isomer.Canvas = Canvas;
Isomer.Color = Color;
Isomer.Path = Path;
Isomer.Point = Point;
Isomer.Shape = Shape;
Isomer.Vector = Vector;

/* Expose Isomer API */
module.exports = Isomer;
