/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// Define the basic array of points for a hexagonal or triangular
// tessellation.
// 
// triPointGridData is an array of objects defining the polygonal area that will
// be displayed. This polygon must be convex. The structure of the array
// elements is as follows:
// {x: an x-coordinate in the triangular coordinate system
// y1: the smallest y-coordinate, for x
// y2: the largest y-coordinate for x}
// x-axis is [1,0], y-axis is [1/2,sqrt(3)/2]
// Naturally the grid coordinates are integers, pos. or neg.,
// but this isn't necessary and is not checked 
//
class TriPointGrid {
    constructor(triPointGridData) {
        var i, j;
        var k = 0;
        this.gridData = triPointGridData;
        this.dL = this.gridData.length;
        this.point = [];

        for (i = 0; i < this.dL; i++) {
            for (j = this.gridData[i].y1; j <= this.gridData[i].y2; j++) {
                this.point[k] = {x: this.gridData[i].x,
                    y: j,
                    key: k
                };
                k++;
            }
        }
    }
}

class TriGrid {
    constructor(triPointGridData, ss = 1) {
        var i, j;
        var k = 0;
        this.gridData = triPointGridData;
        this.dL = this.gridData.length;
        this.point = [];
        this.triString = [];
        this.ss = ss; 

        for (i = 0; i < this.dL; i++) {
            for (j = this.gridData[i].y1; j <= this.gridData[i].y2; j++) {
                this.point[k] = {x: this.gridData[i].x,
                    y: j,
                    key: k
                };
                k++;
            }
        }
        
        for( k = 0; k < this.point.length; k++ ){
            this.triString[k] = this.triPointsString(k);
            //console.log(k, this.triString[k], this.point[k]);
        }
    }
    
    //The 3 vertices in array format  
    triPointsArray(ix){
        var s = this.ss;
        
        var triVx = [ triToR([s*this.point[ix].x, s*this.point[ix].y]), 
            triToR([s*(this.point[ix].x + 1), s*this.point[ix].y]),
            triToR([s*this.point[ix].x, s*(this.point[ix].y + 1)])];
        //console.log(ix,triVx);
        return triVx;
    }
    //The 3 vertices in string format (for polygon "points" attr) 
    triPointsString(ix){
        var points = this.triPointsArray(ix);
        var strOut;
        var str = [];
        var j;
        for (j = 0; j < 3; j++) {
            str[j] = points[j].join(",");
        }
//console.log(str);
        strOut = str.join(" ");
        return strOut;
    }
}

class SquareGrid{
    constructor(sqGridData, ss = 1) {
     var i, j;
        var k = 0;
        this.gridData = sqGridData;
        this.dL = this.gridData.length;
        this.point = [];
        this.sqString = [];
        this.ss = ss; 

        for (i = 0; i < this.dL; i++) {
            for (j = this.gridData[i].y1; j <= this.gridData[i].y2; j++) {
                this.point[k] = {x: this.gridData[i].x,
                    y: j,
                    key: k
                };
                k++;
            }
        }
        
        for( k = 0; k < this.point.length; k++ ){
            this.sqString[k] = this.sqPointsString(k);
            //console.log(k, this.triString[k], this.point[k]);
        }
    }
    
    //The 4 vertices in array format
    sqPointsArray(ix){
        var s = this.ss;
        
        var sqVx = [ [s*(this.point[ix].x + 0.5), s*(this.point[ix].y - 0.5)], 
                     [s*(this.point[ix].x + 0.5), s*(this.point[ix].y + 0.5)],
                     [s*(this.point[ix].x - 0.5), s*(this.point[ix].y + 0.5)],
                     [s*(this.point[ix].x - 0.5), s*(this.point[ix].y - 0.5)] ];
        //console.log(ix,triVx);
        return sqVx;
    }
    
    //The 4 vertices in string format (for polygon "points" attr)
    sqPointsString(ix){
        var points = this.sqPointsArray(ix);
        var strOut;
        var str = [];
        var j;
        for (j = 0; j < 4; j++) {
            str[j] = points[j].join(",");
        }
        
        strOut = str.join(" ");
        return strOut;
    }
}

class Hexagon {
// center = (cx,cy), side = s, color = c
    constructor(cx = 0, cy = 0, s = 1, scale = 1, c = "#ff0000")
    {
        this.cx = cx * scale;
        this.cy = cy * scale;
        this.s = s * scale;
        this.c = c;
        this.index = 0;
    }
    set key(ix) {
        this.index = ix;
    }
    get key() {
        return this.index;
    }
    vertexX(i) {
        return (this.s * Math.cos((i % 6) * Math.PI / 3) + this.cx);
    }
    vertexY(i) {
        return (this.s * Math.sin((i % 6) * Math.PI / 3) + this.cy);
    }
    vertices(i) {
        var pt = [this.vertexX(i), this.vertexY(i)];
        //console.log(pt);
        return pt;
    }
// Array of coordinate pairs [[,],[,]...] 
    hexagonPointsArray() {
        var points = [];
        var j;
        for (j = 0; j < 6; j++) {
            points[j] = this.vertices(j);
            //console.log(j, points);
        }
        return points;
    }

//This is the representation of the vertices of the hexagon
//in the form required by the "points" attribute
    hexagonPointsString() {
        var points = this.hexagonPointsArray();
        var strOut;
        var str = [];
        var j;
        for (j = 0; j < 6; j++) {
            str[j] = points[j].join(",");
        }
//console.log(str);
        strOut = str.join(" ");
        return strOut;
    }

    trianglePointsArray(i) {
        var points = [[this.cx, this.cy],
            [this.vertexX(i % 6), this.vertexY(i % 6)], [this.vertexX((i + 1) % 6), this.vertexY((i + 1) % 6)]];
        return points;
    }

    trianglePointsString(i) {
        var points = this.trianglePointsArray(i);
        var str = [];
        var j;
        for (j = 0; j < 3; j++) {
            str[j] = points[j].join(",");
        }
        str = str.join(" ");
        return str;
    }
///////////////////////////////////////////////////////////////////
// getHexNeighbors()
///////////////////////////////////////////////////////////////////
// Gives the eucl. coordinates of the center of of the 6 nearest
// neighbors of the hexagon at the origin. Side length = 1.
// 
// Returns [[x_0,y_0],...,[x_5,y_5]], [x_0,y_0] at pi/6  
///////////////////////////////////////////////////////////////////
    getHexNeighbors() {

        var v = [];
        var i, a;
        for (i = 0; i < 6; i++) {
            a = Math.PI / 6 + i * Math.PI / 3;
            v[i] = [this.cx + this.s * Math.sqrt(3) * Math.cos(a),
                this.cy + this.s * Math.sqrt(3) * Math.sin(a)];
        }

        return v;
    }
}

///////////////////////  Triangle Class ////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
class Triangle {
    constructor(key = 0, v = [[0, 0], [1, 0], [0.5, Math.sqrt(3) / 2]], c = "#00ff00") {
        this.key = key; // Key for D3 selection (=array index of instance)
        this.vCur = v; // Current vertices
        this.c = c; // Color
        this.vNew = [[0, 0], [1, 0], [0.5, Math.sqrt(3) / 2]]; // Vertices to which this triangle is being moved.
        // when move done - these become current
    }

    updateCoord() {
        var i;
        for (i = 0; i < 3; i++) {
            this.vCur[i][0] = this.vNew[i][0];
            this.vCur[i][1] = this.vNew[i][1];
        }
    }

    initCoord() {
        var i;
        for (i = 0; i < 3; i++) {
            this.vNew[i][0] = this.vCur[i][0];
            this.vNew[i][1] = this.vCur[i][1];
        }
    }

    //String of vertices for current polygon "points" attribute
    vCurString() {
        var points = this.vCur;
        var str = [];
        var j;
        for (j = 0; j < 3; j++) {
            str[j] = points[j].join(",");
        }
        str = str.join(" ");
        return str;
    }

    //String of vertices for new polygon "points" attribute
    vNewString() {
        var points = this.vNew;
        var str = [];
        var j;
        for (j = 0; j < 3; j++) {
            str[j] = points[j].join(",");
        }
        str = str.join(" ");
        return str;
    }
}

///////////////////////  Square Class ////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
class Square{
    constructor(key = 0, cv = [0, 0], c = "#00ff00") {
        this.key = key;     // Key for D3 selection (=array index of instance)
        this.cvCur = cv;    // Current center coordinates
        this.c = c;         // Color
        this.cvNew = [0, 0];// Center coordinates to which this square is to be moved.
                            // when move done - these become current
        this.rotCur = 0;    // Current rotation
        this.rotNew = 0;    // New Rotation angle after transition
    }

    updateCoord() {
        this.cvCur[0] = this.cvNew[0];
        this.cvCur[1] = this.cvNew[1];
        this.rotCur   = this.rotNew; 
    }

    initCoord() {
        this.cvNew[0] = this.cvCur[0];
        this.cvNew[1] = this.cvCur[1];
        this.rotNew   = this.rotCur; 
    }

    //Array of vertices
    //String of vertices for current polygon "points" attribute
    vCurString() {
        var points = this.vCur;
        var str = [];
        var j;
        for (j = 0; j < 3; j++) {
            str[j] = points[j].join(",");
        }
        str = str.join(" ");
        return str;
    }

    //String of vertices for new polygon "points" attribute
    vNewString() {
        var points = this.vNew;
        var str = [];
        var j;
        for (j = 0; j < 3; j++) {
            str[j] = points[j].join(",");
        }
        str = str.join(" ");
        return str;
    }
}
//////////////////////////////////////////////////////////////////////////////
//Finds the vertex closest to p by testing each triangle
//in the triObjArray.
//Returns an object with elements
// x:   x-coordinate of nearest
// y:   y-coordinate
// d:   distance p to [x,y]
// key: key of a triangle to which the nearest point belongs
// vix: index of the vertex in triObj.key
//
function getNearestTriVertex(triObjArray, p) {
    var nL = triObjArray.length;
    var j, k;
    var x, y, d;
    var dp = 1000; //just a large number

    var nearest = {
        x: 0,
        y: 0,
        d: 0,
        key: -1, // meaning not found
        vix: 0
    };
    for (j = 0; j < nL; j++) {
        for (k = 0; k < 3; k++) {
            x = triObjArray[j].vCur[k][0];
            y = triObjArray[j].vCur[k][1];
            d = rectD(p, [x, y]);
            if (d < dp) {
                dp = d;
                nearest.x = x; // x-coordinate
                nearest.y = y; // y-coordinate
                nearest.d = dp; // distance
                nearest.key = j; // key = index in ObjArray 
                nearest.vix = k; // vertex index 0..2
            }
        }
    }
    return nearest;
}
//////////////////////////////////////////////////////////////////////////////
//Finds the vertex closest to p by testing each triangle
//in the triObjArray.
//Returns an object with elements
// x:   x-coordinate of nearest
// y:   y-coordinate
// d:   distance p to [x,y]
// key: key of a triangle to which the nearest point belongs
// vix: index of the vertex in triObj.key
//
function getNearestSqCenter(sqObjArray, p) {
    var nL = sqObjArray.length;
    var j, k;
    var x, y, d;
    var dp = 1000; //just a large number

    var nearest = {
        x: 0,
        y: 0,
        d: 0,
        key: -1, // meaning not found
        vix: 0
    };
    for (j = 0; j < nL; j++) {
        for (k = 0; k < 3; k++) {
            x = sqObjArray[j].vCur[k][0];
            y = sqObjArray[j].vCur[k][1];
            d = rectD(p, [x, y]);
            if (d < dp) {
                dp = d;
                nearest.x = x; // x-coordinate
                nearest.y = y; // y-coordinate
                nearest.d = dp; // distance
                nearest.key = j; // key = index in ObjArray 
                nearest.vix = k; // vertex index 0..2
            }
        }
    }
    return nearest;
}
///////////////////////////////////////////////////////////////////////////////
// Given the array of vertices of a polygon,
// returns a string in the form required by SVG polygon.points attribute.
// NB The returned value is a string, not an array.
///////////////////////////////////////////////////////////////////////////////
function makePolygonString(points) {

    var strOut;
    var str = [];
    var j;
    for (j = 0; j < points.length; j++) {
        str[j] = points[j].join(",");
    }

    strOut = str.join(" ");
    return strOut;
}

// p is any coordinate pair, triObjectArray a list of Triangle objects.
// Find the nearest vertex and return the indices
// of the triangles meeting at that vertex
// s is a limiting value: distances > s not
// of interest and are ignored
//
// Returns array of 6 (or fewer) triangle indices (keys)
//
function getTriNeighbors(triObjArray, p, s) {
    var nL = triObjArray.length;
    var i, j, k, d, key, tem;
    var dvx = [];
    var ix = [];
    for (i = 0; i < 6; i++) {
        dvx[i] = s + 1;
        ix[i] = -1;
    }

    for (j = 0; j < nL; j++) {
        for (k = 0; k < 3; k++) {
            d = rectD(p, triObjArray[j].vCur[k]);
            key = j;
            //If d is less than the largest current distance, insert it
            //in the ordered list  
            if (d < dvx[5]) {
                dvx[5] = d;
                ix[5] = key;
                for (i = 5; i > 0; i--) {
                    if (dvx[i] < dvx[i - 1]) {
                        tem = dvx[i];
                        dvx[i] = dvx[i - 1];
                        dvx[i - 1] = tem;
                        tem = ix[i];
                        ix[i] = ix[i - 1];
                        ix[i - 1] = tem;
                    }
                }
            }
        }
    }

    if (dvx[5] > (s / 2)) {
        for (i = 0; i < 6; i++) {
            ix[i] = -1;
        }
    }
    return ix;
}


// TriObj is an array of Triangle objects
// key is an array of triangle keys
// The routine sorts the triangles TriObj[t[i]]
// acc to angle (0...2pi) by ordering the keys in the
// output array accordingly
//
// p0 is the "origin" - the angle being compared is
// the angle of the centroid of the triangle
// wrt p0. 
// If the origin is a vertex common to all the triangles the effect
// is an ordering arround that vertex  
// Returns array containing t[i] in order of angle
//
function sortTriByAngle(triObj, key, p0) {
    var nK = key.length;
    var nT = triObj.length;
    var i, k;
    var ctr = [];
    var theta = [];
    var list = [];
    var sortedKeys = [];
    for (i = 0; i < nT; i++) {
        for (k = 0; k < nK; k++) {
            if (triObj[i].key === key[k]) {
                ctr[k] = [(triObj[i].vCur[0][0] + triObj[i].vCur[1][0] + triObj[i].vCur[2][0]) / 3,
                    (triObj[i].vCur[0][1] + triObj[i].vCur[1][1] + triObj[i].vCur[2][1]) / 3];
            }
        }
    }

    for (k = 0; k < nK; k++) {
        theta[k] = Math.atan2(ctr[k][1] - p0[1], ctr[k][0] - p0[0]);
        list[k] = {"key": key[k], "theta": theta[k]};
    }

    list.sort(function (a, b) {
        return(a.theta - b.theta);
    });
    for (k = 0; k < nK; k++) {
        sortedKeys[k] = list[k].key;
    }
    return sortedKeys;
}

// triObj[] is an array of Triangle Objects 
// key[] is an array of keys referring to triObj elements,
// each of which should have the vertex = p0.
// The routine rotates the triangles specified by key in such
// a way that p0 appears in the same position in the old and new
// polygon, i.e. in the vCur (old) and vNew polygon "points" sequence .
// 
// The reason for this maneuver is that the common vertex will stay
// in place during the transition from current to new position, thus
// the hexagon will appear to rotate.
//
function centerRotation(triObj, key, p0) {
    var j, k, jCur, jNew, jx;
    var nK = key.length;
    var eps = 0.001;
    for (k = 0; k < nK; k++) {
        jCur = -1;
        jNew = -1;
        for (j = 0; j < 3; j++) {
            if (rectD(triObj[key[k]].vNew[j], p0) < eps) {
                jNew = j;
            }
            if (rectD(triObj[key[k]].vCur[j], p0) < eps) {
                jCur = j;
            }
        }

        if ((jNew > -1) && (jCur > -1)) {
            jx = (3 + jNew - jCur) % 3;
            for (j = 0; j < jx; j++) {
                triObj[key[k]].vNew.push(triObj[key[k]].vNew.shift()); //rotate left
            }
        }
    }
}