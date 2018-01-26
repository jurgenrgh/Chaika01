/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//>>>>>>>>>>>>Obsolete: use geometricFunctions.js <<<<<<<<<<<<<<<<<<<<<<<<<<<<
// 
///////////////////////////////////////////////////////////////////////////////            
///////////// Functions  ////////////////////////////////////////////////////// 
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Coordinate transformations
/////////////////////////////////////////////////////////////////////////////
// Rectangular <==> normal euclidean coordinates
// Triangular  <==> basis vectors e1 = [1,0], e2 = [1/2, sqrt(3)/2]
// Hexagonal   <==> 3 basis vectors: 120 degrees apart
//                  e1 = [1,0], e2 = [-1/2, sqrt(3)/2], e3 = [-1/2, -sqrt(3)/2]
//                  these coordinates are not unique; they are said to be
//                  "normalized" if one coordinate is zero and the
//                  other two are positive; this can always be arranged 
//                  since e1 + e2 + e3 = 0. 
// Tessellation                  
///////////////////////////////////////////////////////////////////////////////
//                   
////////////////////////////////////////////////////////////////////
// Rotate the vector p, given in rectilinear coordinates
// by theta radians about p0
// returns rect. coord. of rotated vector q
////////////////////////////////////////////////////////////////////
function rotateRect(p, p0, theta)
{
    var q = [];
    //console.log(p,p0,theta);        
    q[0] = p0[0] + (p[0] - p0[0]) * Math.cos(theta) - (p[1] - p0[1]) * Math.sin(theta);
    q[1] = p0[1] + (p[0] - p0[0]) * Math.sin(theta) + (p[1] - p0[1]) * Math.cos(theta);
    //console.log(p,p0,q,theta);
    return q;
}

////////////////////////////////////////////////////////////////////
// Rotate the vector p, given in triangular coordinates
// by theta radians about p0
// returns tri. coord. of rotated vector q
////////////////////////////////////////////////////////////////////
function rotateTri(p, p0, theta)
{
    var pr = triToRect(p);
    var pr0 = triToRect(p0);
    var s = rotateRect[pr, pr0, theta];
    var q = rectToTri[s];

    return q;
}

////////////////////////////////////////////////////////////////////
// Rotate the vector p, given in hex coordinates ( 3 components)
// by theta radians about p0
// returns hex coord. of rotated vector q
////////////////////////////////////////////////////////////////////
function rotateHex(p, p0, theta)
{
    var pr = hexToRect(p);
    var pr0 = hexToRect(p0);
    var s = rotateRect[pr, pr0, theta];
    var q = rectToHex[s];

    return q;
}
///////////////////////////////////////////////////////////////////
// Convert from triangular to rectilinear coordinates
///////////////////////////////////////////////////////////////////
function triToRect(p) {
    var q = [];

    q[0] = p[0] + p[1] / 2;
    q[1] = p[1] * Math.sqrt(3) / 2;

    return q;
}

///////////////////////////////////////////////////////////////////
// Convert from rectilinear to triangular coordinates
///////////////////////////////////////////////////////////////////
function rectToTri(p) {
    var q = [];

    q[0] = p[0] - p[1] / Math.sqrt(3);
    q[1] = p[1] * 2 / Math.sqrt(3);

    return q;
}

///////////////////////////////////////////////////////////////////////////////
// Hexagonal coordinates are specified (non-uniquely) by (h1,h2,h3)
// wrt the three basis vectors
// e1 = [1,0], e2 = [-1/2, sqrt(3)/2], e3 = [-1/2, -sqrt(3)/2]
// which are unit vectors pointing from the origin to 3 vertices of a hexagon;
// the other 3 vertices are -e1, -e2, -e3. 
///////////////////////////////////////////////////////////////////////////////
function hexToRect(p) {
    var a = Math.sqrt(3) / 2;
    var q = [p[0] - (p[1] / 2) - (p[2] / 2), (p[1] * a) - (p[2] * a)];
    return q;
}

///////////////////////////////////////////////////////////////////////////////
// Returns hex given rectangular coordinates.
// The hex coordinates are normalized, i.e. one component is zero, the other
// two are positive.  
///////////////////////////////////////////////////////////////////////////////
function rectToHex(p) {
    var a = Math.sqrt(3);
    var q0 = [0, -p[0] + p[1] / a, -p[0] - p[1] / a];
    var q = normalizeHex(q0);
    return q;
}

///////////////////////////////////////////////////////////////////////////////
// Hex coordinates are normalized when the arithmetically
// smallest component is zero.
///////////////////////////////////////////////////////////////////////////////
function normalizeHex(p) {
    var min = Math.min(p[0], p[1], p[2]);
    var q = [p[0] - min, p[1] - min, p[2] - min];
    return q;
}

// Tessellation coordinates are given by 3 components
// wrt basis vectors [2,1,0],[0,2,1],[1,0,2] given
// in terms of hex coordinates.
// These are the 3 vectors pointing to the centers of 3
// neighboring hexagons.

// Same normalization as for hex coordinates: 2 coordinates are
// positive, one is zero
function normalizeTess(p) {
    var min = Math.min(p[0], p[1], p[2]);
    var q = [p[0] - min, p[1] - min, p[2] - min];
    return q;
}

function tessToRect(p) {
    var a = Math.sqrt(3) / 2; //altitude
    var q = [(3 * p[0] / 2) - (3 * p[1] / 2), (a * p[0]) + (a * p[1]) - (2 * a * p[2])];
    return q;
}

function rectToTess(p) {
    var a = Math.sqrt(3) / 2;
    var q0 = [(p[0] / 3) + (p[1] / (2 * a)), -(p[0] / 3) + (p[1] / (2 * a)), 0];

    var q = normalizeHex(q0);
    //console.log(p,q0,q);
    return q;
}

//////////// The above are now in geometricFunctions.js /////////////////////
/////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////
// 20 "good" colors; i.e. colors with good contrast
// returns color[n mod 20]
///////////////////////////////////////////////////////////////////
function gcolor(n) {
    var colors_g = ["#3366cc", "#dc3912", "#ff9900", "#109618",
        "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e",
        "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc",
        "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
    return colors_g[n % colors_g.length];
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
    //console.log(str);
    strOut = str.join(" ");
    return strOut;
}

// p is any coordinate pair
// Find the nearest vertex and return the indices
// of the 6 triangles meeting at that vertex
// s is a limiting value: distances > s not
// of interest and are ignored
function getTriNeighbors(triObjArray, p, s) {
    var nL = triObjArray.length;
    var i, j, k, d, key, tem;
    var dvx = [];
    var ix = [];

    for (i = 0; i < 6; i++) {
        dvx[i] = s + 1;
        ix[i] = -1;
    }
    //console.log(nL,p,s);
    for (j = 0; j < nL; j++) {
        for (k = 0; k < 3; k++) {
            d = rectD(p, triObjArray[j].vCur[k]);
            key = j;
            //console.log(j,k,d,s);
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

    //console.log(key, p0, nT, nK);
    for (i = 0; i < nT; i++) {
        for (k = 0; k < nK; k++) {
            if (triObj[i].key === key[k]) {
                ctr[k] = [(triObj[i].vCur[0][0] + triObj[i].vCur[1][0] + triObj[i].vCur[2][0]) / 3,
                    (triObj[i].vCur[0][1] + triObj[i].vCur[1][1] + triObj[i].vCur[2][1]) / 3];

            }
        }
    }
    //console.log(ctr);    

    for (k = 0; k < nK; k++) {
        theta[k] = Math.atan2(ctr[k][1] - p0[1], ctr[k][0] - p0[0]);
        //console.log(ctr,p0);
        list[k] = {"key": key[k], "theta": theta[k]};
    }

    //console.log(list);
    list.sort(function (a, b) {
        return(a.theta - b.theta);
    });
    //console.log(list);
    for (k = 0; k < nK; k++) {
        sortedKeys[k] = list[k].key;
    }
    //console.log(sortedKeys);
    return sortedKeys;
}

// triObj[] is an array of Triangle Objects 
// key[] is an array of keys referring to triObj elements,
// each of which should have the vertex = p0.
// The routine rotates the triangles specified by key in such
// a way that p0 appears in the same position in the old and new
// polygon, i.e. in the vCur (old) and vNew polygon "points" sequence .
// 
function centerRotation(triObj, key, p0) {
    var j, k, jCur, jNew, jx;
    var nK = key.length;
    var eps = 0.001;
    
        //console.log(triObj[19].vCur[0], triObj[19].vCur[1], triObj[19].vCur[2]);
        //console.log(triObj[19].vNew[0], triObj[19].vNew[1], triObj[19].vNew[2]);
        //console.log(triObj[19].vCur, triObj[19].vNew);
    //console.log(nK, p0, key);
    for (k = 0; k < nK; k++) {
        //console.log(triObj[key[k]].vCur[0], triObj[key[k]].vCur[1], triObj[key[k]].vCur[2]);
        //console.log(triObj[key[k]].vNew[0], triObj[key[k]].vNew[1], triObj[key[k]].vNew[2]);
        //console.log(triObj[key[k]].vCur, triObj[key[k]].vNew);
        //console.log(k, key[k], triObj[key[k]].vNew, triObj[key[k]].vCur);
        jCur = -1;
        jNew = -1;
        for (j = 0; j < 3; j++) {
            //console.log(k, j, rectD(triObj[key[k]].vCur[j], p0), triObj[key[k]].vCur[j], triObj[key[k]].vCur);
            if (rectD(triObj[key[k]].vCur[j], p0) < eps) {
                jCur = j;
                //console.log(j, jNew, jCur, rectD(triObj[key[k]].vCur[j], p0), triObj[key[k]].vCur[j], triObj[key[k]].vCur);
            }
            //console.log(triObj[key[k]].vCur[0], triObj[key[k]].vCur[1], triObj[key[k]].vCur[2]);
            //console.log(triObj[key[k]].vNew[0], triObj[key[k]].vNew[1], triObj[key[k]].vNew[2]);
            //console.log(k, j, key[k], p0, triObj[key[0]].vNew[j], triObj[key[k]].vNew[1], triObj[19].vNew[1], triObj[key[k]].vNew[j], triObj[key[k]].vNew);
            //console.log(k, j, rectD(triObj[key[k]].vNew[j], p0));
            
            if (rectD(triObj[key[k]].vNew[j], p0) < eps) {
                jNew = j;
                //console.log(j, jNew, jCur, rectD(triObj[key[k]].vNew[j], p0), triObj[key[k]].vNew[j], triObj[key[k]].vNew);
            }
            //console.log(triObj[key[k]].vCur[0], triObj[key[k]].vCur[1], triObj[key[k]].vCur[2]);
            //console.log(triObj[key[k]].vNew[0], triObj[key[k]].vNew[1], triObj[key[k]].vNew[2]);
        }
        //console.log(jNew, jCur);
        if ((jNew > 0) && (jCur > 0)) {
            jx = (3 + jNew - jCur) % 3;
            //console.log(jx);
            for (j = 0; j < jx; j++) {
                triObj[key[k]].vNew.push(triObj[key[k]].vNew.shift()); //rotate left
            }
        }
        //console.log(k, triObj[key[k]].vNew, triObj[key[k]].vCur);
    }

}
//Distance between 2 pts in rectilinear coordinates
function rectD(p, q) {
    var dx, dx2;
    var s2 = 0;

    var n = Math.min(p.length, q.length);
    var i;
    //console.log(p,q);
    for (i = 0; i < n; i++) {
        dx = p[i] - q[i];
        dx2 = dx * dx;
        s2 = s2 + dx2;
    }
    s2 = Math.sqrt(s2);
    //console.log(p,q,s2);
    return s2;
}

//Finds the vertex closest to p by testing each triangle
//in the triObjArray.
//Returns an array of 3 numbers: [obj-index, vertex-index, distance]  
function getNearestTriVertex(triObjArray, p, s) {
    var nL = triObjArray.length;
    var j, k;
    var x, y, d;
    var dp = s;

    var nearest = new Object;
    nearest.key = -1;

    for (j = 0; j < nL; j++) {
        for (k = 0; k < 3; k++) {
            x = triObjArray[j].vCur[k][0];
            y = triObjArray[j].vCur[k][1];
            d = rectD(p, [x, y]);
            if (d < dp) {
                dp = d;
                nearest.x = x;      // x-coordinate
                nearest.y = y;      // y-coordinate
                nearest.key = j;    // key = index in ObjArray 
                nearest.vix = k;    // vertex index 0..2
            }
        }
    }
    return nearest;
}