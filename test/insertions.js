var octree = require('../');
var inspect = require('util').inspect;

(function testInsertions() {

    var o = octree();
	var x = 10;

    // insert x objects
    for (var i = 0; i < x; ++i) {
        o.insert(i, i, i, i);
    }

    function objects_count(node) {
        if (node.type === undefined || node.type===1) {
            return node.data.length;
        }
        count=0;
        for (var i in node.data) { 
            count += objects_count(node.data[i]);
        }
        return count;
    }

    // check how many objects are there
    var objs = objects_count(o);
    if (x !== objs) {
        console.log(inspect(o, {colors: true, depth: null}));
        throw new Error("Not every object was successfully inserted! (Should be "+x+", but there are only " + objs + ")");
    }
})();
