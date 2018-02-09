/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function makeSqrGrid(gridPointDef, colorDef, moveRef, normTile, ss = 1)
{
    var dL = gridPointDef.length;
    var i, j, k, n;
    var points = [];

    k = 0;
    for (n = 0; n < dL; n++)
    {
        for (i = gridPointDef[n].x1; i <= gridPointDef[n].x2; i++)
        {
            for (j = gridPointDef[n].y1; j <= gridPointDef[n].y2; j++)
            {
                //console.log(k, i, j);
                points[k] = {
                    key: k,
                    x: ss * i,
                    y: ss * j,
                    tile: makeSqrTile(ss * i, ss * j, normTile, ss),
                    color: colorDef[i - gridPointDef[n].x1][j - gridPointDef[n].y1],
                    tokenIx: k 
                };
                //console.log(k, i, j,points[k]);
                k++;
            }
        }
        // The moveRef array must have exactly the same dimensions as the
        // points array
        k = 0;
        for (j = 0; j < moveRef.length; j++)
        {
            for (i = 0; i < moveRef[j].length; i++)
            {
                points[k].move = moveRef[i][j];
                k++;
            }
        }
        return points;
}
}

//Returns an array of vertices defining the polygon
function  makeSqrTile(x, y, tileDef, ss = 1)
{
    var nT = tileDef.length;
    var tile;
    var v = [];
    var vx, vy;
    //console.log(x, y, tileDef, ss);
    for (var m = 0; m < nT; m++)
    {
        vx = x + ss * tileDef[m][0];
        vy = y + ss * tileDef[m][1];
        v[m] = [vx, vy];
    }
    tile = v.slice();
    //console.log(tile);
    return tile;
}

//The vertices of a polygon in string format (for polygon "points" attr)
function  makeVertexString(vxList)
{
    var nL = vxList.length;
    var strOut;
    var str = [];
    var j;

    for (j = 0; j < nL; j++)
    {
        str[j] = vxList[j].join(",");
    }
    strOut = str.join(" ");
    return strOut;
}



// From p = [x,y] return the index for the containing
// tile. 
function sqrTileIndex(p, points)
{
    var i;
    var ix = -1;
    var np = points.length;
    //console.log(p,points);
    for (i = 0; i < np; i++)
    {
        if (d3.polygonContains(points[i].tile, p))
        {
            ix = i;
            //console.log(ix);
        }
    }
    //console.log(p, key);
    return ix;
}

// From p = [x,y] return the index for the containing
// circle of radius r. 
function circleTileIndex(p, points, r)
{
    var i;
    var ix = -1;
    var np = points.length;
    var dd; 
    //console.log(p,r,points);
    for (i = 0; i < np; i++)
    {
        dd = rectD(p, [points[i].x,points[i].y]);
        if (dd < r)
        {
            ix = i;
            //console.log(ix);
        }
    }
    //console.log(p, ix);
    return ix;
}

// The token is the thing that moves from tile to tile
// Initially it inherits its attributes from a tile
// key:   arbitrary unique permanent index; initially the same as the tile key
// color: a permanent attribute assigned by external data (colorDef in the Grid)
// angle: a variable attribute the comes from the move definition
// keyTile: token key; the backward pointer to the current Token. 
//        keyTile is treated as a key (i.e. an attribute) rather than an index
//        although presently both are the same, but this might change in future
// Change: keyTile is changed to index: ixTile; this requires that the array of tokens
//          retains its order permanently
function makeSqrTokens(points)
{
    var tokens = [];
    var pn = points.length;
    var n;

    for (n = 0; n < pn; n++)
    {
        tokens[n] = {
            key: points[n].key,
            color: points[n].color,
            angle: 0,
            ixTile: n,
            newColor: points[n].color,
            newAngle: 0,
            newIxTile: n
        };
    }
    return tokens;
}

//Simply sets current values = new values
//called after transition from cur to new has happened 
function updateSqrToken(tokens, ix)
{
    tokens[ix].color = tokens[ix].newColor;
    tokens[ix].angle = tokens[ix].newAngle;
    tokens[ix].ixTile = tokens[ix].newIxTile;
}

//Get token array index from token key
//function keyTokenToIxToken(tokens, key)
//{
//    var nt = tokens.length;
//    var ix = 0;
//    var n;
//
//    for (n = 0; n < nt; n++)
//    {
//        if (key === tokens[n].key)
//        {
//            ix = n;
//        }
//    }
//    return ix;
//}
//
////Get tile array index from tile key
//function keyTileToIxTile(tiles, key)
//{
//    var np = tiles.length;
//    var ix = 0;
//    var n;
//
//    for (n = 0; n < np; n++)
//    {
//        if (key === tiles[n].key)
//        {
//            ix = n;
//        }
//    }
//    return ix;
//}
//
//function keyTokenToIxTile(tokens, tiles, key)
//{
//    var ixToken = keyTokenToIxToken(tokens, key);
//    var keyTile = tokens[ixToken].keyTile;
//    var ixTile = keyTileToIxTile(tiles, keyTile);
//
//    return ixTile;
//}

