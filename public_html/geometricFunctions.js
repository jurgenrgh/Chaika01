/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

///////////////////////////////////////////////////////////////////////////////
// Coordinate transformations
///////////////////////////////////////////////////////////////////////////////
// Rectangular <=> normal euclidean coordinates [x,y]
// 
// Polar       <=> [r,phi], r = sqrt(x*x + y*y), phi = atan2(y,x)
//                 NB atan2 returns a value v: -pi <= v <= pi. 
//                 
// Triangular  <=> basis vectors e1 = [1,0], e2 = [1/2, sqrt(3)/2]
// 
// Hexagonal   <=> 3 basis vectors: 120 degrees apart
//                  x1 = [1,0], x2 = [-1/2, sqrt(3)/2], x3 = [-1/2, -sqrt(3)/2]
//                  these coordinates are not unique; they are said to be
//                  "normalized" if one coordinate is zero and the
//                  other two are positive; this can always be arranged 
//                  since e1 + e2 + e3 = 0.
//                    
// Tessellation <=> 3 basis vectors 120 degrees apart (h = sqrt(3)/2)
//                  t1 = [3/2,h], t2 = [-3/2,h], t3 = [0,2h]
//                  Again the coordinates are not unique and "normalized"
//                  means that the arithmetically smallest coordinate value
//                  is zero.
//                  
// For a regular hexagon with one vertex at [x,y]=[1,0] and center at the
// origin Hexagonal coordinate basis vectors point at 3 vertices, Tessellation
// basis vectors point at the centers of 3 neighboring hexagons.
// The latter are useful because in a complete hexagonal tessellation
// of the plane the centers of the hexagons have integer hex coordinates.                     
//                                    
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Polar to Rectilinear
// Returns [x,y], x = r*cos(phi), y = r*sin(phi)
//
function polarToR(r, phi) {
    var x, y;
    var p = [0, 0];

    x = r * Math.cos(phi);
    y = r * Math.sin(phi);

    p = [x, y];

    return p;
}

///////////////////////////////////////////////////////////////////////////////
// Rectilinear to polar
// p = [x,y]
// Returns [r,phi], r = sqrt(x*x + y*y), phi = atan2(y,x),
// -pi <= phi <= pi
//
function RtoPolar(p) {
    var x = p[0];
    var y = p[1];
    var q = [1, 0];

    var r = Math.sqrt(x * x + y * y);
    var phi = Math.atan2(y, x);

    q = [r, phi];

    return q;
}

///////////////////////////////////////////////////////////////////
// Triangular to Rectilinear
//
function triToR(p) {
    var q = [1, 0];
    var x, y;

    x = p[0] + p[1] / 2;
    y = p[1] * Math.sqrt(3) / 2;

    q = [x, y];

    return q;
}

///////////////////////////////////////////////////////////////////
// Rectilinear to Triangular coordinates
//
function rToTri(p) {
    var x = p[0];
    var y = p[1];
    var q1, q1;
    var q = [1, 0];

    q1 = x - (y / Math.sqrt(3));
    q2 = y * 2 / Math.sqrt(3);

    q = [q1, q2];

    return q;
}

///////////////////////////////////////////////////////////////////////////////
// Hexagonal coordinates are specified (non-uniquely) by (h1,h2,h3)
// wrt the three basis vectors
// e1 = [1,0], e2 = [-1/2, sqrt(3)/2], e3 = [-1/2, -sqrt(3)/2]
// which are unit vectors pointing from the origin to 3 vertices of a hexagon;
// the other 3 vertices are -e1, -e2, -e3. 
///////////////////////////////////////////////////////////////////////////////
function hexToR(p) {
    var a = Math.sqrt(3) / 2;
    var x, y;
    var q = [1, 0];

    x = p[0] - (p[1] / 2) - (p[2] / 2);
    y = (p[1] * a) - (p[2] * a);

    q = [x, y];

    return q;
}

///////////////////////////////////////////////////////////////////////////////
// Returns hex given rectangular coordinates.
// The hex coordinates are normalized, i.e. one component is zero, the other
// two are positive.  
///////////////////////////////////////////////////////////////////////////////
function rToHex(p) {
    var a = Math.sqrt(3);

    var x = p[0];
    var y = p[1];

    var q = [1, 0, 0];

    var q1 = 0;
    var q2 = -x + (y / a);
    var q3 = -x - (y / a);

    var q0 = [q1, q2, q3];

    q = normalizeHex(q0);

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

///////////////////////////////////////////////////////////////////////////////
// Tessellation coordinates are given by 3 components
// wrt basis vectors; in terms of hex coordinates these are
// [2,1,0],[0,2,1],[1,0,2], i.e. 3 vectors pointing to the centers of 3
// neighboring hexagons.
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Tess coordinates to rectilinear
//
function tessToR(p) {
    var a = Math.sqrt(3) / 2; //altitude
       
    var x = (3 * p[0] / 2) - (3 * p[1] / 2);
    var y = (a * p[0]) + (a * p[1]) - (2 * a * p[2]);
    
    var q = [x,y];
    
    return q;
}

///////////////////////////////////////////////////////////////////////////////
// Rectilinear to Tess coordinates
//
function rToTess(p) {
    var a = Math.sqrt(3) / 2;
    
    var x = p[0];
    var y = p[1];
    
    var q1 = (x / 3) + (y / (2 * a));
    var q2 = -(x / 3) + (y / (2 * a));
    var q3 = 0;
    
    var q = [q1,q2,q3];

    var t = normalizeHex(q);
    
    return t;
}

// Same normalization as for hex coordinates: 2 coordinates are
// positive, one is zero
function normalizeTess(p) {
    var min = Math.min(p[0], p[1], p[2]);
    var q = [p[0] - min, p[1] - min, p[2] - min];
    return q;
}

/////////////////////////////////////////////////////////////////////////////
//Distance between 2 pts in rectilinear coordinates, any dimension
//
function rectD(p, q) {
    var dx, dx2;
    var n = Math.min(p.length, q.length);
    var i;
    
    var s2 = 0;
    for (i = 0; i < n; i++) {
        dx = p[i] - q[i];
        dx2 = dx * dx;
        s2 += dx2;
    }
    s2 = Math.sqrt(s2);
    
    return s2;
}

// Returns an array of coordinate pairs defining
// the tile polygon.
//
// basis: base vectors; only the first 2 components are used
// point: the base point of the tile; the normTile coordinate values are added 
//          to this; so the first vertex of normTile might be [0,0] but
//          it might also be e.g. the midpoint of the tile
// normTile: an array of coordinate pairs defining a tile based at [0,0] with unit side
// ss: side length of the polygon
//
function makeTile(basis, point, normTile, ss){
    var vxList = [];
    
    for( var i = 0; i < normTile.length; i++ ){
        vxList[i] = [point.x + ss * (normTile[i][0]*basis[0][0] + normTile[i][1]*basis[1][0]),
                            point.y + ss * (normTile[i][0]*basis[0][1] + normTile[i][1]*basis[1][1])];
    }
    return vxList;
}
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

