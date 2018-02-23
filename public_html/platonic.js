(function () {
    var phi = (Math.sqrt(5) + 1) / 2; //golden ratio
    var rho = 180 / Math.PI;
    var iphi = (Math.sqrt(5) - 1) / 2; //inverse phi = 1/phi

    // Vertices and Faces of the 5 regular polyhedra,
    // centered at [0,0,0]
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
    //console.log(fDodecahedron);

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
    
    var vertices;// = vDodecahedron;
    var faces;// = fDodecahedron;

    d3.geodesic = {
        multipolygon: function (polyType) {

            if (polyType == "Tetrahedron") {
                vertices = vTetrahedron;
                faces = fTetrahedron;
            }
            if (polyType == "Cube") {
                vertices = vCube;
                faces = fCube;
            }
            if (polyType == "Octahedron") {
                vertices = vOctahedron;
                faces = fOctahedron;
            }
            if (polyType == "Dodecahedron") {
                vertices = vDodecahedron;
                faces = fDodecahedron;
            }
            if (polyType == "Icosahedron") {
                vertices = vIcosahedron;
                faces = fIcosahedron;
            }

            return {
                type: "MultiPolygon",

                coordinates: faces.map(function (face) {

                    face = face.map(project);

                    face.push(face[0]);
                    //console.log(face);
                    return [face];
                })
            };
        }

    };

    function project(p) {
        var x = p[0],
            y = p[1],
            z = p[2];
        return [
            Math.atan2(y, x) * rho,
            Math.acos(z / Math.sqrt(x * x + y * y + z * z)) * rho - 90
        ];
    }
})();



