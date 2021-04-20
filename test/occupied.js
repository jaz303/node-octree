var octree = require('../');
var inspect = require('util').inspect;

(function testOccupied() {

    var o = octree();

    // insert an object twice on the same place: first insertion works, second shouldn't
    var free = o.insert(0, 0, 0, "first");
    var occupied = o.insert(0, 0, 0, "second");

    if (!(free && !occupied))
        throw new Error("The varification of an occupied position failed.");
})();
