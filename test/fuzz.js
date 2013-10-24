var octree = require('../');
var inspect = require('util').inspect;

function r() {
    return (Math.random() * 2) - 1;
}

(function testStructure() {

    var o = octree();

    for (var i = 0; i < 100000; ++i) {
        o.insert(r(), r(), r(), i);
    }

    function check(node) {
        if (node.type === 1) {
            node.data.forEach(function(d, ix) {
                if (   d.x < (node.ox - node.hx)
                    || d.x > (node.ox + node.hx)
                    || d.y < (node.oy - node.hy)
                    || d.y > (node.oy + node.hy)
                    || d.z < (node.oz - node.hz)
                    || d.z > (node.oz + node.hz)) {

                    console.log(inspect(node, {colors: true}));

                    throw new Error("constraint violated at index: " + ix);
                }
            });
        } else {
            node.data.forEach(check);
        }
    }

    check(o);

})();

(function testNearestNeighbours() {

    var o = octree();
    var data = [];

    for (var i = 0; i < 200; ++i) {
        var d = {x: r(), y: r(), z: r(), val: i};
        data.push(d);
        o.insert(d.x, d.y, d.z, d.val);
    }

    for (var i = 0; i < 10000; ++i) {
        var x = r(), y = r();
        
    }

})();