var LEAF        = 1,
    PARENT      = 2,
    MAX_ITEMS   = 4;

function Octree(ox, oy, oz, hx, hy, hz) {

    this.ox = ox;
    this.oy = oy;
    this.oz = oz;

    this.hx = hx;
    this.hy = hy;
    this.hz = hz;

    this.type = LEAF;
    this.data = [];

}

Octree.prototype.insert = function(x, y, z, data) {
	// FIXME: this function is letting you insert something in an already occupied place (two things in the same exact coordinates), which causes problems along the road

    if (this.type === LEAF) {
        if (this.data.length < MAX_ITEMS) {
            this.data.push({x: x, y: y, z: z, data: data});
        } else {
            var children    = [],
                nhx         = this.hx * 0.5,
                nhy         = this.hy * 0.5,
                nhz         = this.hz * 0.5;
    
            for (var i = 0; i < 8; ++i) {
                var nox = this.ox + nhx * ((i & 1) ? 1 : -1),
                    noy = this.oy + nhy * ((i & 2) ? 1 : -1),
                    noz = this.oz + nhz * ((i & 4) ? 1 : -1);
                children[i] = new Octree(nox, noy, noz, nhx, nhy, nhz);
            }
	
			this.data.push({x:x, y:y, z:z, data:data});
   			var indexes = this._indexesForPoints(this.data);

			for (var i in this.data) {
				children[indexes[i]].insert(this.data[i].x, this.data[i].y, this.data[i].z, this.data[i].data);
			}

            this.type = PARENT;
            this.data = children;
        }
    } else {
        this.data[this._indexForPoint(x, y, z)].insert(x, y, z, data);
    }
}

Octree.prototype.nearestNeighbour = function(x, y, z) {

}

Octree.prototype._indexForPoint = function(x, y, z) {
    var ix = 0;
    if (x > this.ox) ix |= 1;
    if (y > this.oy) ix |= 2;
    if (z > this.oz) ix |= 4;
    return ix;
}

Octree.prototype._indexesForPoints = function(points) {
    // we get several points, we decide which one is the best... in relation
	var individuals = [];
	for (var i in points) {
		individuals[i] = this._indexForPoint(points[i].x, points[i].y, points[i].z);
	}
	var counter = [];
	for (var i in individuals) {
		if (counter[individuals[i]] === undefined ) counter[individuals[i]] = 1;
		else counter[individuals[i]]++;
	}
	for (var i=0; i<8; i++) { if (counter[i] === undefined) counter[i] = 0; }
	var conflicts = false;
	for (var i in counter) {
		if (counter[i] > MAX_ITEMS) conflicts = true;
	}
	if (!conflicts) return individuals;

	// FIXME: this only works if we are trying to put only one more item than it fits. That will fix the use case I see, but we should make it more robust...
	for (var i in counter) {
		if (counter[i] >= MAX_ITEMS) {
			// here's the problem we need to fix... 
			//        ________
			//      /|6     7/|
			//     /_|_____ / |
			//    | 2|    3|  |
			//    |  |4____|5_|
			//    | 0     1| /
			//    |/_______|/
			
			// TODO: this *huge* if should be actually one to three calls to a private function. We're basically doing the same thing three times (once for each axis)...

			// let's first try to move in the z axis
			if ((i > 3) && (counter[eval(i-4)] < MAX_ITEMS)) {
				// we can move it BACK in the z axis... let's find out which of the items we want to move
				var minz = [];
				for (var ind in individuals) {
					if (individuals[ind] == i) {
						if (minz.length === 0) { minz.push (ind); }
						else if (points[ind].z < points[minz[0]].z) {minz = [ind]; }
						else if (points[ind].z === points[minz[0]].z) {minz.push(ind); }
					}
				}
				if (counter[eval(i-4)] + minz.length <= MAX_ITEMS) { // if not, we can't move'em BACK on the z axis after all...
					// great, we just have to move those!
					for (var ind in minz) {
						individuals[ind] = individuals[ind] - 4;
					}
					return individuals;
				} 
			} else if ((i < 4) && (counter[eval(i+4)] < MAX_ITEMS)) { // maybe we can move it FORWARD in the z axis?
				var maxz = [];
				for (var ind in individuals) {
					if (individuals[ind] == i) {
						if (maxz.length === 0) { maxz.push(ind); }
						else if (points[ind].z > points[maxz[0]].z) { maxz = [ind]; }
						else if (points[ind].z === points[maxz[0]].z) {maxz.push(ind); }
					}
				}
				if (counter[eval(i+4)] + maxz.length <= MAX_ITEMS) { // if not, we can't move'em on the z axis at all!
					for (var ind in maxz) { individuals[ind] = individuals[ind] + 4; }
					return individuals;
				}
			}

			// no? OK, let's try the x axis then...
			var even = (i === parseFloat(i)? !(i%2) : void 0);
			if ((even && (counter[(i+1)] < MAX_ITEMS)) || ((!even) && (counter[(i-1)] < MAX_ITEMS))) {
				// there's space to move in the x axis
				var movex = []; 
				for (var ind in individuals) {
					if (individuals[ind] == i) {
						if (movex.length === 0) { movex.push(ind); }
						else if ((even && (points[ind].x > points[movex[0]].x)) || ((!even) && (points[ind].x < points[movex[0]].x))) { movex = [ind]; }
						else if (points[ind].x === points[movex[0]].x) {movex.push(ind);}
					}
				}
				if ((even && (counter[(i+1)] + movex.length <= MAX_ITEMS)) || ((!even) && (counter[(i-1)] + movex.length <= MAX_ITEMS))) { 
					for (var ind in movex) { if(even){individuals[ind]++;} else {individuals[ind]--;} };
					return individuals;
				}
			}

			// still here? OK, no choice but to move'em in the y axis
			//[0,1,4,5] -> (+2) -> [2,3,6,7] 
			var down = ((i%4) < 1);
			if ((down && (counter[(i+2)] < MAX_ITEMS)) || ((!down) && (counter[(i-2)] < MAX_ITEMS))) {
				var movey = [];
				for (var ind in individuals) {
					if (individuals[ind] == i) {
						if (movey.length === 0) { movey.push(ind); }
						else if ((down && (points[ind].y > points[movey[0]].y)) || ((!down) && (points[ind].y < points[movey[0]].y))) { movey = [ind]; }
						else if (points[ind].y === points[movey[0]].y) {movey.push(ind);}
					}
				}
				if ((down && (counter[(i+2)] + movey.length <= MAX_ITEMS)) || ((!down) && (counter[(i-2)] + movey.length <= MAX_ITEMS))) {
					for (var ind in movey) { if(down){individuals[ind]=individuals[ind]+2;} else {individuals[ind]=individuals[ind]-2;} };
					return individuals;
				}
			}
			console.log("FATAL ERROR: you should NEVER be here, your data has possibly been corrupted!");
		}
	}
}


module.exports = function() {

    // TODO: configurable origin/size
    return new Octree(0, 0, 0, 1, 1, 1);

}
