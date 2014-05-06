/**
 * The Isomer class
 *
 * This file contains the Isomer base definition
 */
function Isomer(canvasId, options) {
  options = options || {};

  this.canvas = new Isomer.Canvas(canvasId);
  this.angle = Math.PI / 6;

  this.scale = options.scale || 70;

  this.originX = options.originX || this.canvas.width / 2;
  this.originY = options.originY || this.canvas.height * 0.9;

  /**
   * Light source as defined as the angle from
   * the object to the source.
   *
   * We'll define somewhat arbitrarily for now.
   */
  this.lightPosition = options.lightPosition || new Isomer.Vector(2, -1, 3);
  this.lightAngle = this.lightPosition.normalize();

  /**
   * The maximum color difference from shading
   */
  this.colorDifference = 0.20;
  this.lightColor = options.lightColor || new Isomer.Color(255, 255, 255);
}

/**
 * Sets the light position for drawing.
 */
Isomer.prototype.setLightPosition = function (x, y, z) {
  this.lightPosition = new Isomer.Vector(x, y, z);
  this.lightAngle = this.lightPosition.normalize();
}

Isomer.prototype._translatePoint = function (point) {
  var Point = Isomer.Point;

  /**
   * X rides along the angle extended from the origin
   * Y rides perpendicular to this angle (in isometric view: PI - angle)
   * Z affects the y coordinate of the drawn point
   */
  var xMap = new Point(point.x * this.scale * Math.cos(this.angle),
                       point.x * this.scale * Math.sin(this.angle));

  var yMap = new Point(point.y * this.scale * Math.cos(Math.PI - this.angle),
                       point.y * this.scale * Math.sin(Math.PI - this.angle));

  var x = this.originX + xMap.x + yMap.x;
  var y = this.originY - xMap.y - yMap.y - (point.z * this.scale);
  return new Point(x, y);
};


/**
 * Adds a shape or path to the scene
 *
 * This method also accepts arrays
 */
Isomer.prototype.add = function (item, baseColor) {
  var Path = Isomer.Path;
  var Shape = Isomer.Shape;

  if (Object.prototype.toString.call(item) == '[object Array]') {
    for (var i = 0; i < item.length; i++) {
      this.add(item[i], baseColor);
    }
  } else if (item instanceof Path) {
    this._addPath(item, baseColor);
  } else if (item instanceof Shape) {
    /* Fetch paths ordered by distance to prevent overlaps */
    var paths = item.orderedPaths();
    for (var i in paths) {
      this._addPath(paths[i], baseColor);
    }
  }
};

/**
 * Adds an array of {shape: yourShape, color: yourColor} to the scene,
 * ordered so that distant faces are displayed first
 *  */
Isomer.prototype.addOrdered = function (item) { // array of {shape:, color:}
  var Point = Isomer.Point;
  //var observer = new Point(-10, -10, 10);
  var observer = new Point(-10, -10, 20);
  var pathList = [];
  var index = 0;
  for (var i = 0; i < item.length; i++) {
    for(var j = 0 ; j < item[i].shape.paths.length ; j++){
      pathList[index] = {
        path: item[i].shape.paths[j],
        color: item[i].color,
		drawn: 0
      };
      index++;
    }
  }

  
  
 /* pathList = [
    //pathList[0],
	pathList[1],
	//pathList[2],
	//pathList[3],
	//pathList[4],
    // pathList[5],pathList[6],pathList[7],pathList[8],pathList[9],
    //pathList[10],pathList[11],
	//pathList[12],
	//pathList[13],
	pathList[14],
    //pathList[15],
	//pathList[16],pathList[17],pathList[18],pathList[19],
   // pathList[20],pathList[21],pathList[22],pathList[23],pathList[24],
    //pathList[25],
	//pathList[26],
	//pathList[27]

  ];*/
  //pathList = [pathList[1],pathList[3]];

  //pathList = [pathList[1], pathList[2],];
  //pathList[10],pathList[11]];
  //console.log(pathList[0].path.points);
  //console.log(pathList[2].path.points);
  
    
  //console.log("0->2 " + pathList[0].path._countCloserThan(pathList[2].path, observer));
  //console.log("2->0 " + pathList[2].path._countCloserThan(pathList[0].path, observer));
  //console.log("conclude " + pathList[0].path.closerThan(pathList[2].path, observer));
  
  // console.log("0->1 " + pathList[0].path._countCloserThan(pathList[1].path, observer));
  // console.log("1->0 " + pathList[1].path._countCloserThan(pathList[0].path, observer));
  // console.log("conclude " + pathList[0].path.closerThan(pathList[1].path, observer));
 
 // topological sort
  
  var drawBefore = [];
  for (var i = 0 ; i < pathList.length ; i++){
	drawBefore[i] = [];
  }
  for (var i = 0 ; i < pathList.length ; i++){
    for (var j = 0 ; j < i ; j++){
	  if(this._hasIntersection(pathList[i].path, pathList[j].path)){
	    var cmpPath = pathList[i].path.closerThan(pathList[j].path, observer);
	    if(cmpPath < 0){
	      drawBefore[i][drawBefore[i].length] = j;
	    }
	    if(cmpPath > 0){
	      drawBefore[j][drawBefore[j].length] = i;
	    }
	  } else {
	    //console.log("no intesect : " + i + " " + j);
	  }
	}
  }
  for (var i = 0 ; i < pathList.length ; i++){
    console.log(i);
    console.log(drawBefore[i]);
  }

  var drawThisTurn = 1;
  var index = 0;
  while(drawThisTurn == 1){
    console.log("turn " + index);
	index++;
	drawThisTurn = 0;
	for (var i = 0 ; i < pathList.length ; i++){
	  if(pathList[i].drawn == 0){
	    var canDraw = 1;
		for (var j = 0 ; j < drawBefore[i].length ; j++){
		  if(pathList[drawBefore[i][j]].drawn == 0){canDraw = 0;}
		}
		if(canDraw == 1){
		   this._addPath(pathList[i].path, pathList[i].color);
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
	  console.log("purging : "+i);
	  this._addPath(pathList[i].path, pathList[i].color);
	}
  }
  
  
};


//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/math/is-point-in-poly [rev. #0]
function isPointInPoly(poly, pt){
    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
        && (c = !c);
    return c;
}


/**
 * Does pathA has intersection with pathB ?
 * Naïve approach done first : approximate the paths with a rectangle
 * Then more complex method
 */
Isomer.prototype._hasIntersection = function(pathA, pathB) {
  var pointsA = pathA.points.map(this._translatePoint.bind(this));
  var pointsB = pathB.points.map(this._translatePoint.bind(this));
  var i, j;
  //console.log("_hasIntersection");
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
  
  //console.log([AminX, AmaxX, BminX, BmaxX, AminY, AmaxY, BminY, BmaxY]);
  
  if(((AminX <= BminX && BminX <= AmaxX) || (BminX <= AminX && AminX <= BmaxX)) && 
     ((AminY <= BminY && BminY <= AmaxY) || (BminY <= AminY && AminY <= BmaxY))) {
    // now let's be more specific
   // console.log("points A pointsB polyA polyB");
	//console.log(pointsA);
	//console.log(pointsB);
	var polyA = pointsA.slice();
	var polyB = pointsB.slice();
	polyA.push(pointsA[0]);
	polyB.push(pointsB[0]);
	//console.log(polyA);
	//console.log(polyB);
	// Parse common rectangle to find intersection. For better performance, we can monte-carlo this.
	for(i = Math.floor(Math.max(AminX, BminX)) + 1 ; i <= Math.ceil(Math.min(AmaxX, BmaxX)) - 1 ; i++){
	  for(j = Math.floor(Math.max(AminY, BminY)) + 1 ; j <= Math.ceil(Math.min(AmaxY, BmaxY)) - 1 ; j++){
	    if(isPointInPoly(polyA, {x:i, y:j}) && isPointInPoly(polyB, {x:i, y:j})){
		  //console.log("return 1");
		  return 1;
		}
	  }
	}
	//console.log("return 00");
	return 0;
  } else {
    //console.log("return 0");
    return 0;
  }

};

/**
 * Adds a path to the scene
 */
Isomer.prototype._addPath = function (path, baseColor) {
  var Color = Isomer.Color;
  var Vector = Isomer.Vector;

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
