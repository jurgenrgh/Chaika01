//////////////////////////////////////////////////////////////////////////////// 
// Classes for Tesselation of Plane Regions by
// Squares, Triangles or Hexagons  
////////////////////////////////////////////////////////////////////////////////
//
// Simple square point array, same scale x and y direction 
// Data gives for each x a first and a last y
// Cordinates shauld be normalized - x,y are integers -
// but this isn't checked
//
// The useful function of the class is to define a potentially 
// irregularly shaped regions and to enumerate them. 
// ss  is horizontal and vertical distance
//
class SquarePointGrid {
    constructor(sqPointGridData, ss) {
        var i, j;
        var k = 0;
        this.gridData = sqPointGridData;
        this.dL = this.gridData.length;
        this.point = [];
        this.nbrPoints = 0;
        this.ss = ss;

        for (i = 0; i < this.dL; i++) {
            for (j = this.gridData[i].y1; j <= this.gridData[i].y2; j++) {
                this.point[k] = {
                    x: ss * this.gridData[i].x,
                    y: ss * j,
                    key: k
                };
                k++;
            }
        }
        //console.log(this.point);
        this.nbrPoints = k;
    }

    // From [x,y] return the key for the nearest
    // point. S is a scale factor
    //
    getKey(p) {
        var i;
        var d = rectD(p, [this.point[0].x, this.point[0].y]);
        var dd = d;
        var k = 0;
        //console.log(p, s, d, s * this.point[0].x, s * this.point[0].y);

        for (i = 0; i < this.nbrPoints; i++) {
            //console.log(i, p, s, [s*this.point[0].x, s*this.point[0].y]);
            dd = rectD(p, [this.point[i].x, this.point[i].y]);
            if (dd < d) {
                k = i;
                d = dd;
            }
            //console.log(i, k, p, s, d, dd, s * this.point[i].x, s * this.point[i].y);
        }
        return k;
    }
    // Get xy-coordinates from the key
    getXY(key) {
        var i;
        var p = [];
        for (i = 0; i < this.nbrPoints; i++) {
            if (this.point[i].key === key) {
                p[0] = this.point[i].x;
                p[1] = this.point[i].y;
            }
        }
        return p;
    }
}

////////////////////////////////////////////////////////////////////////////////
// Tiling by squares. Reference point is the center because this is more
// natural than corner in case of triangles.
//
// sqGridData is a structure that lists y1,y2 as start and end for a list
// of x-values. The coordinates are assumed to be integers.
//
class SquarePolyGrid {
    constructor(sqGridData, sqMoveData, sqGridColors, ss = 1) {
        var i, j, m;
        var c, move;
        var k = 0;
        this.gridData = sqGridData;
        this.colorData = sqGridColors;
        this.moveData = sqMoveData;
        this.dL = this.gridData.length;
        this.tile = [];
        this.square = [];
        this.nbrTiles = 0;
        this.ss = ss;           //side length

        // Set coordinates of the midpoints and generate index (key) 
        for (i = 0; i < this.dL; i++) {
            for (j = this.gridData[i].y1; j <= this.gridData[i].y2; j++) {
                m = j - this.gridData[i].y1;
                c = this.colorData[i][m];
                move = this.moveData[i][m];
                this.tile[k] = {
                    x: this.ss * this.gridData[i].x,
                    y: this.ss * j,
                    color: c,
                    key: k,
                    move: move,
                    squareIx: k
                };
                this.square[k] = new Square(k, 0, c);
                k++;
            }
        }
        this.nbrTiles = k;
    }

//The 4 vertices in array format. 
    tileVertexArray(ix) {
       // console.log(ix, this.tile[ix] )
        var tileVx = [[this.tile[ix].x + 0.5 * this.ss, this.tile[ix].y - 0.5 * this.ss],
            [this.tile[ix].x + 0.5 * this.ss, this.tile[ix].y + 0.5 * this.ss],
            [this.tile[ix].x - 0.5 * this.ss, this.tile[ix].y + 0.5 * this.ss],
            [this.tile[ix].x - 0.5 * this.ss, this.tile[ix].y - 0.5 * this.ss]];
        return tileVx;
    }

//The 4 vertices in string format (for polygon "points" attr)
    tileVertexString(ix) {
        
        //console.log(ix, this.tile[ix]);
        var points = this.tileVertexArray(ix);
        var strOut;
        var str = [];
        var j;
        for (j = 0; j < 4; j++) {
            str[j] = points[j].join(",");
        }
        strOut = str.join(" ");
        return strOut;
    }

// From p = [x,y] return the key for the containing
// tile. 
//
    getKey(p) {
        var i;
        var key = -1;
        for (i = 0; i < this.nbrTiles; i++) {
            //console.log(i, p, this.tileVertexArray(i));
            if (d3.polygonContains(this.tileVertexArray(i), p)) {
                key = this.tile[i].key;
            }
        }
        //console.log(p, key);
        return key;
    }

// Get xy-coordinates of center from the key
    getXY(key) {
        var i;
        var p = [];
        for (i = 0; i < this.nbrTiles; i++) {
            if (this.tile[i].key == key) {
                p[0] = this.tile[i].x;
                p[1] = this.tile[i].y;
            }
        }
        return p;
    }
    
    //Return key of the square currently on this tile
    getSquareKey(p){
        var tileKey = this.getKey(p);
        return this.square[this.tile[tileKey].squareIx].key;
    }
    
    //////////////////////////////////////////////////////////////////////////////
    // Finds the square in which p lies by testing each square
    //
    // Returns an object with elements
    // cx:   x-coordinate of nearest center
    // cy:   y-coordinate
    // key: key of the tile in which p lies
    // If no containing square key = -1
    //
    getNearestSquareCenter(p) {
        var k;
        var nearest = {
            cx: 0,
            cy: 0,
            key: -1, // meaning not found
        };

        k = this.getKey(p);
        //console.log(k,p);
        if (k > 0) {
            nearest.key = k;
            nearest.cx = this.tile[k].x;
            nearest.cy = this.tile[k].y;
        }
        return nearest;
    }

    //////////////////////////////////////////////////////////////////////////////
    // Finds the vertex closest to p provided
    // that click was in a square
    //  
    // Returns an object with elements
    // vx:   x-coordinate of nearest vertex
    // vy:   y-coordinate
    // key:  key for containing square
    // If no containing square key = -1
    //
    getNearestSquareVertex(p) {
        var i, k;
        var vArray = [];
        var nL;
        var dMin, iMin;
        var nearest = {
            x: 0,
            y: 0,
            key: -1 // meaning not found
        };

        k = this.getKey(p);

        console.log(k, p);
        if (k > 0) {
            vArray = this.tileVertexArray(k);
            nL = vArray.length;
            dMin = rectD(p, vArray[0]);
            iMin = 0;

            for (i = 1; i < nL; i++) {
                console.log(p, i, vArray[i]);
                if (rectD(p, vArray[i]) < dMin) {
                    dMin = rectD(p, vArray[i]);
                    iMin = i;
                }
            }
            nearest.x = vArray[iMin][0];
            nearest.y = vArray[iMin][1];
            nearest.key = k;
        }
        return nearest;
    }

    // MoveDef is an array of structures
    // {x0: original center x
    //  y0: original center y
    //  x1: destination cenetr x
    //  y1: destination center y
    //  rot: rotation angle / 90degr }
    //
    // MoveOrigins is an array of vertices [x,y]
    // each entry specifying a center of rotation.
    //
    // fromKey identifies the square that was clicked 
    //
    squareMove(p, sqMoveDef, sqMoveOrigins) {
        var n;
        var nM = sqMoveOrigins.length;
        var eps = 0.001;    //near zero small number
        var tx, ty, kx, ky;
        var bFound = false;
        var nearest = {
            x: 0,
            y: 0,
            key: -1 // meaning not found
        };

        // Key of containing square; < 0 if none 
        var fromKey = this.getKey(p);
        console.log(fromKey, p);

        if (fromKey >= 0) {
            kx = this.tile[fromKey].x;
            ky = this.tile[fromKey].y;

            // Look for a move
            for (n = 0; n < nM; n++) {
                tx = this.ss * sqMoveOrigins[n][0];
                ty = this.ss * sqMoveOrigins[n][1];

                //Checks if the center of the square is the rotation center of a move
                if (rectD([tx, ty], [kx, ky]) < eps) {
                    nearest.x = tx;
                    nearest.y = ty;
                    nearest.key = fromKey;
                    bFound = true;
                }
            }
            if (bFound === false) {
                // Check if one of the vertices is the rotation center of a move
                nearest = this.getNearestSquareVertex(p);
                if (nearest.key >= 0) {
                    kx = nearest.x;
                    ky = nearest.y;
                    for (n = 0; n < nM; n++) {
                        tx = this.ss * sqMoveOrigins[n][0];
                        ty = this.ss * sqMoveOrigins[n][1];
                        //Check if the center of the square is the rotation center of a move
                        if (rectD([tx, ty], [kx, ky]) < eps) {
                            nearest.x = tx;
                            nearest.y = ty;
                            nearest.key = fromKey;
                            bFound = true;
                        }
                    }
                }
            }
        }
        return nearest;
    }

}


class Square {
    constructor(ixGrid, angle, color) {
        //
        // Current Values
        this.key = ixGrid;      //permanent id of this square
        this.ixTile = ixGrid;   //current grid location; i.e. index of the tile in the grid; 
        this.angle = angle;
        this.color = color;

        // New values - become current after transition
        this.newIxTile = ixGrid;
        this.newAngle = angle;
        this.newColor = color;
    }

    //Values for new position and color
    init(ixTile, angle, color) {
        this.newIxTile = ixTile;
        this.newAngle = angle;
        this.newColor = color;
    }

    //New values become current
    update() {
        if (this.ixTile != this.newIxTile) {
            console.log(this.ixTile, this.newIxTile);
        }
        this.ixTile = this.newIxTile;
        this.angle = this.newAngle;
        this.color = this.newColor;
    }
}
