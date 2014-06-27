var octree = require('../');
var inspect = require('util').inspect;

function r() {
    return (Math.random() * 2) - 1;
}

(function testInsertions() {

    var o = octree();

    if (!o.insert(r(), r(), r(), r())) {
        throw new Error("failed to insert valid node");
    }

    if (o.insert(r()+3, r(), r(), r())) {
        throw new Error("invalid node inserted");
    }

})();
