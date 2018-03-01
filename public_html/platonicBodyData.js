var phi = (Math.sqrt(5) + 1) / 2; //golden ratio
var rho = 180 / Math.PI;
var iphi = (Math.sqrt(5) - 1) / 2; //inverse phi = 1/phi

// Vertices and Faces of the 5 regular polyhedra,
// centered at [0,0,0]
// First the vertices are explicitly assigned, then the
// faces are defined in terms of vertex indices
//
var vTetrahedron = [
    [+1, +1, +1], [-1, -1, +1], [+1, -1, -1], [-1, +1, -1]
];

var fTetrahedron = [
    [0, 1, 2], [1, 0, 3], [2, 3, 0], [3, 2, 1]
].map(function (face) {
    return face.map(function (i) {
        return vTetrahedron[i];
    });
});

var vCube = [
    [+1, +1, +1], [-1, +1, +1], [-1, -1, +1], [+1, -1, +1],
    [+1, +1, -1], [+1, -1, -1], [-1, -1, -1], [-1, +1, -1]
];

var fCube = [
    [0, 1, 2, 3], [0, 4, 7, 1], [6, 7, 4, 5],
    [3, 2, 6, 5], [0, 3, 5, 4], [1, 7, 6, 2]
].map(function (face) {
    return face.map(function (i) {
        return vCube[i];
    });
});
//console.log(fCube);

var vOctahedron = [
    [0, 0, 1], [0, 0, -1], [1, 0, 0],
    [-1, 0, 0], [0, 1, 0], [0, -1, 0]
];

var fOctahedron = [
    [0, 2, 4], [0, 4, 3], [0, 3, 5], [0, 5, 2],
    [1, 2, 5], [1, 4, 2], [1, 3, 4], [1, 5, 3]
].map(function (face) {
    return face.map(function (i) {
        return vOctahedron[i];
    });
});

var vDodecahedron = [
    [+1, +1, +1], [-1, +1, +1], [-1, -1, +1], [+1, -1, +1],
    [+1, +1, -1], [-1, +1, -1], [-1, -1, -1], [+1, -1, -1],
    [0, phi, iphi], [0, phi, -iphi], [0, -phi, iphi], [0, -phi, -iphi],
    [phi, iphi, 0], [phi, -iphi, 0], [-phi, iphi, 0], [-phi, -iphi, 0],
    [iphi, 0, phi], [iphi, 0, -phi], [-iphi, 0, phi], [-iphi, 0, -phi]
];

var fDodecahedron = [
    [0, 16, 3, 13, 12], [3, 16, 18, 2, 10], [2, 15, 6, 11, 10], [3, 10, 11, 7, 13],
    [7, 11, 6, 19, 17], [4, 12, 13, 7, 17], [0, 12, 4, 9, 8], [1, 8, 9, 5, 14],
    [0, 8, 1, 18, 16], [1, 14, 15, 2, 18], [5, 19, 6, 15, 14], [4, 17, 19, 5, 9]
].map(function (face) {
    return face.map(function (i) {
        return vDodecahedron[i];
    });
});

var vIcosahedron = [
    [1, phi, 0], [-1, phi, 0], [1, -phi, 0], [-1, -phi, 0],
    [0, 1, phi], [0, -1, phi], [0, 1, -phi], [0, -1, -phi],
    [phi, 0, 1], [-phi, 0, 1], [phi, 0, -1], [-phi, 0, -1]
];

var fIcosahedron = [
    [0, 1, 4], [1, 9, 4], [4, 9, 5], [5, 9, 3], [2, 3, 7],
    [3, 2, 5], [7, 10, 2], [0, 8, 10], [0, 4, 8], [8, 2, 10],
    [8, 4, 5], [8, 5, 2], [1, 0, 6], [11, 1, 6], [3, 9, 11],
    [6, 10, 7], [3, 11, 7], [11, 6, 7], [6, 0, 10], [9, 1, 11]
].map(function (face) {
    return face.map(function (i) {
        return vIcosahedron[i];
    });
});

function project(p) {
    var x = p[0],
        y = p[1],
        z = p[2];
    return [
        Math.atan2(y, x) * rho,
        Math.acos(z / Math.sqrt(x * x + y * y + z * z)) * rho - 90
    ];
};

//Input is the list of all the faces of the specified polyhedron.
//Each face is given as an array of (x,y,z) vertices
//Output is the same structure except that the vertices are
//projected onto a unit sphere and coordinates are (longitude,latitude) 
function getFaces(polyType) {
    var faces = [];
    var planeFaces = [];

    if (polyType == "Tetrahedron") {
        faces = fTetrahedron;
    }
    if (polyType == "Cube") {
        faces = fCube;
    }
    if (polyType == "Octahedron") {
        faces = fOctahedron;
    }
    if (polyType == "Dodecahedron") {
        faces = fDodecahedron;
    }
    if (polyType == "Icosahedron") {
        faces = fIcosahedron;
    }
    planeFaces = faces.map(function (face) {
        face = face.map(project);
        return face;
    });

    return planeFaces;
}

//Input is an array of [x,y] vertices representing 
//a polygon. 
//Output is the same set of vertices in form of a string
//as required by the "points" attribute in a "polygon" selection 
function vertexString(points) {
    
    var strOut;
    var str = [];
    var j;
    for (j = 0; j < points.length; j++) {
        str[j] = points[j].join(",");
    }
    strOut = str.join(" ");
    return strOut;
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