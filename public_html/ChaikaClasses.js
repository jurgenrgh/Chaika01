/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// The grid definition consists of an array of objects with format
// {x1: first x-value
//  x2: last x-value
//  y1: first y-value, same for each x
//  y2: last y-value, same for each x}
//
// Such an object defines the coordinates of a square array of points
// in the grid. If the grid is not a square the specification
// will most likely consist of an entry per row
//
// The following defines an 8 by 8 square: 
// var gridDataSq8x8 = [{x1: -4, x2: +3, y1: -4, y2: +3}];
// A color is assigned to each grid entry; distinct 
// integers indicate distinct colors 
// var gridColorsSq8x8 = [
//    [1, 1, 1, 1, 0, 0, 0, 0],
//    [1, 1, 1, 1, 0, 0, 0, 0],
//    [1, 1, 1, 1, 0, 0, 0, 0],
//    [1, 1, 1, 1, 0, 0, 0, 0],
//    [1, 1, 1, 1, 0, 0, 0, 0],
//    [1, 1, 1, 1, 0, 0, 0, 0],
//    [1, 1, 1, 1, 0, 0, 0, 0],
//    [1, 1, 1, 1, 0, 0, 0, 0]];
/////////////////////////////////////////////////////////////
// Base Vectors /////////////////////////////////////////////
// //////////////////////////////////////////////////////////
// In general there are 3 basis vectors e1, e2, e3
// e1 and e2 must be linearly independent. e3 may be null.
//
// The natural arrangement in the case of triangular or hexagonal
// tesselations consists of 3 unit vectors 120degrees apart; one
// of these might well be [1,0] or [0.5,sqrt(3)/2].  
// The function normalize(x1,x2,x3) returns a vector [z1,z2,0]
// equal to [x1,x2,x3]
//
class Basis
{
    constructor(e1, e2, e3)
    {
        this.v = [[e1[0], e1[1]], [e2[0], e2[1]], [e3[0], e3[1]]];
    }

    toRect(x1, x2, x3)
    {
        var rc = [];
        rc[0] = x1 * this.v[0][0] + x2 * this.v[1][0] + x3 * this.v[2][0];
        rc[1] = x1 * this.v[0][1] + x2 * this.v[1][1] + x3 * this.v[2][1];
        return rc;
    }

    fromRect(x1, x2)
    {
        var z = [];
        var eps = 0.00001; // near zero
        var d = this.v[0][0] * this.v[1][1] - this.v[0][1] * this.v[1][0];
        //descriminant must be != 0 
        if (Math.abs(d) < eps)
        {
            d = 1; //if only happens if basis is invalid
        }
        z[0] = (x1 * this.v[1][1] - x2 * this.v[1][0]) / d;
        z[1] = (-x1 * this.v[0][1] + x2 * this.v[0][0]) / d;
        return z;
    }

    normalize(x1, x2, x3)
    {
        var z = [];
        var eps = 0.00001; // near zero
        var d = this.v[0][0] * this.v[1][1] - this.v[0][1] * this.v[1][0];
        if (Math.abs(d) < eps)
        {
            d = 1; //if only happens if basis is invalid
        }
        var a = (this.v[2][0] * this.v[1][1] - this.v[2][1] * this.v[1][0]) / d;
        var b = (-this.v[2][0] * this.v[0][1] + this.v[2][1] * this.v[0][0]) / d;
        z[0] = x1 + a * x3;
        z[1] = x2 + b * x3;
        z[2] = 0;
        return z;
    }
}

////////////////////////////////////////////////////////////////////////////////
//
// The grid is a simple array of points relative to a particular
// basis. 
//  
// Data in gridDef gives for each x a first and a last y
// Coordinates are normalized - x,y are integers - ss, if present
// defines the actual distance unit; e.g. side length of a tile.
//
// normTile is a polygon given relative to [0,0] and with side length = 1
//     
// The useful function of the class is to define a potentially 
// irregularly shaped regions and to enumerate them. 
// 
//
class PointGrid
{
    constructor(basis, gridDef, gridColor, normTile, ss = 1)
    {
        var i, j, m, n;
        var k = 0;

        this.basis = basis.v;
        this.gridDef = gridDef;
        this.gridColor = gridColor;
        this.normTile = normTile;
        this.dL = this.gridDef.length;
        this.points = [];
        this.nbrPoints = 0;
        this.tiles = [];
        this.nbrTiles = 0;
        this.ss = ss;

        //console.log(this.basis);
        for (n = 0; n < this.dL; n++)
        {
            for (j = this.gridDef[n].x1; j <= this.gridDef[n].x2; j++)
            {
                for (i = this.gridDef[n].y1; i <= this.gridDef[n].y2; i++)
                {
                    this.points[k] = {
                        key: k,
                        x: this.ss * (this.basis[0][0] * i + this.basis[1][0] * j),
                        y: this.ss * (this.basis[0][1] * i + this.basis[1][1] * j),
                        color: this.gridColor[j - this.gridDef[n].x1][i - this.gridDef[n].y1],
                        //tile: new Tile(this.points[k], this.normTile, this.points[k].key, this.ss, this.points[k].key, this.points[k].color)
                    };
                    k++;
                    //console.log(n, i, j, k, this.points);
                }
            }
        }
        //console.log(this.points);
        this.nbrPoints = k;

        // Generate the Tiles
        for (k = 0; k < this.nbrPoints; k++)
        {
            this.tiles[k] = new Tile(this.points[k], this.normTile, this.points[k].key, this.ss, this.points[k].key, this.points[k].color);
        }
        this.nbrTiles = this.nbrPoints;
    }

// From [x,y] return the key for the nearest
// point. S is a scale factor
//
    getKey(p)
    {
        var i;
        var d = rectD(p, [this.point[0].x, this.point[0].y]);
        var dd = d;
        var k = 0;
        //console.log(p, s, d, s * this.point[0].x, s * this.point[0].y);

        for (i = 0; i < this.nbrPoints; i++)
        {
//console.log(i, p, s, [s*this.point[0].x, s*this.point[0].y]);
            dd = rectD(p, [this.point[i].x, this.point[i].y]);
            if (dd < d)
            {
                k = i;
                d = dd;
            }
//console.log(i, k, p, s, d, dd, s * this.point[i].x, s * this.point[i].y);
        }
        return k;
    }
// Get xy-coordinates from the key
    getXY(key)
    {
        var i;
        var p = [];
        for (i = 0; i < this.nbrPoints; i++)
        {
            if (this.point[i].key === key)
            {
                p[0] = this.point[i].x;
                p[1] = this.point[i].y;
            }
        }
        return p;
    }
}

// A Tile is an elementary cell of the grid
class Tile
{
    constructor(point, normTile, key = 0, ss = 1, ixToken = 0, color = '#ff0000')
    {
        this.key = key;         // An invariant index
        this.ss = ss;           // Side length where the shape is a regular polyhedron
        this.ixToken = ixToken; // The index of the current occupant of the tile
        this.color = color;     // Initial value. The token determines the foreground
        this.point = point;
        this.normTile = normTile;
        this.vxList = []; // List of vertices; 2D Euclidean

        for (var i = 0; i < normTile.length; i++)
        {
            this.vxList[i] = [this.point.x + this.ss * this.normTile[i][0], this.point.y + this.ss * this.normTile[i][1]];
        }
    }

    // Set color and vertex coordinates
    init(vx, color)
    {
        this.color = color;
        for (var i = 0; i < vx.length; i++)
        {
            this.vxList[i] = vx[i];
        }
    }
}

// A Tile is an elementary cell of the grid
class Token
{
    constructor(key = 0, ss = 1, ixTile = 0)
    {
        this.key = key; // An invariant index
        this.ss = ss; // Side length where the shape is a regular polyhedron
        this.ixTile = ixTile; // The index of the current tile
        this.color = '#ff0000'; // Initial value. 
        this.angle = 0; // Rotation angle
        this.newIxTile = this.ixTile;
        this.newColor = this.color;
        this.newAngle = this.angle;
    }

// Set color and vertex coordinates
    init(color, angle, ixTile)
    {
        this.ixTile = ixTile;
        this.color = color;
        this.angle = angle;
    }

// Set color and vertex coordinates
    update()
    {
        this.ixTile = this.newIxTile;
        this.color = this.newColor;
        this.angle = this.newAngle;
    }
}

class Square
{
    constructor(ixGrid, angle, color)
    {
//
// Current Values
        this.key = ixGrid; //permanent id of this square
        this.ixTile = ixGrid; //current grid location; i.e. index of the tile in the grid; 
        this.angle = angle;
        this.color = color;
        // New values - become current after transition
        this.newIxTile = ixGrid;
        this.newAngle = angle;
        this.newColor = color;
    }

//Values for new position and color
    init(ixTile, angle, color)
    {
        this.newIxTile = ixTile;
        this.newAngle = angle;
        this.newColor = color;
    }

//New values become current
    update()
    {
        if (this.ixTile != this.newIxTile)
        {
            console.log(this.ixTile, this.newIxTile);
        }
        this.ixTile = this.newIxTile;
        this.angle = this.newAngle;
        this.color = this.newColor;
    }
}

function getGridPointsList(gridDef, gridColors, vBase, ss)
{

    var i, j;
    var nx, ny;
    var points = [];
    var k = 0;
    for (i = 0; i < gridDef.length; i++)
    {
        for (j = 0; j <= gridDef[i].y2 - gridDef[i].y1; j++)
        {
            nx = gridDef[i].x;
            ny = gridDef[i].y1 + j;
            points[k] = {
                x: ss * (nx * vBase[0][0] + ny * vBase[1][0]),
                y: ss * (nx * vBase[0][1] + ny * vBase[1][1]),
                c: gcolor(gridColors[i][j])
            };
            k++;
        }
    }
    return points;
}

// Generate the detection regions: For each move
// there is a region (here it is a triangle), i.e.
// a mouse click in this region triggers the corresponding move
// 
function getMoveClickRegions(gridDef, gridCol, moveDef, moveRef, vBase, ss)
{
    var i, j, n, m;
    var nx, ny;
    var x, y;
    var move = [];
    var tile = [];
    var color;
    var nmv; // Nbr of vertices in a move          
    var nnm = moveDef.length; //Number of normalized moves
    var ngr = gridDef.length; //Number of grid rows
    var m = 0;
    // Get normalized list of vertices
    for (n = 0; n < nnm; n++)
    {                         //for each move type
        nmv = moveDef[n].length; //nbr of vertices in the move 
        for (i = 0; i < ngr; i++)
        {                     //for each grid row i and col j
            for (j = 0; j <= gridDef[i].y2 - gridDef[i].y1; j++)
            {
                if (moveRef[n][i][j] === 1)
                {           //if there is a move base point here
                    nx = gridDef[i].x;
                    ny = gridDef[i].y1 + j;
                    x = ss * (nx * vBase[0][0] + ny * vBase[1][0]); //the grid point xy coord
                    y = ss * (nx * vBase[0][1] + ny * vBase[1][1]);
                    color = gcolor(gridCol[i][j]);
                    for (k = 0; k < nmv; k++)
                    {           //for each move vertex
                        xx = x + ss * (moveDef[n][k][0] * vBase[0][0] + moveDef[n][k][1] * vBase[1][0]);
                        yy = y + ss * (moveDef[n][k][0] * vBase[0][1] + moveDef[n][k][1] * vBase[1][1]);
                        move[k] = [xx, yy];
                        //console.log(n,i,j,k,move[k]);
                    }

                    tile[m] = new Tile(m, ss);
                    //console.log(n,i,j,k,m,tile[m]);
                    tile[m].init(move, color);
                    //console.log(n,i,j,k,m,tile[m].color);
                    m++;
                }
            }
        }
    }
    return tile;
}