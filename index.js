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

    // check if insertion is within boundaries, return false otherwise
    if ((this.ox + this.hx < x) || (this.ox - this.hx > x) || (this.oy + this.hy < y) || (this.oy - this.hy > y) || (this.oz + this.hz < z) || (this.oz - this.hz > z)) 
        return false;

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

            this.data.forEach(function(d) {
                children[this._indexForPoint(d.x, d.y, d.z)].insert(d.x, d.y, d.z, d.data);
            }, this);

            this.type = PARENT;
            this.data = children;
            this.data[this._indexForPoint(x, y, z)].insert(x, y, z, data);
        }
    } else {
        this.data[this._indexForPoint(x, y, z)].insert(x, y, z, data);
    }

    return true;
}

Octree.prototype.occupied = function(x, y, z) {
    // returns true if there's a point in these coordinates, false otherwise

	// if coordinates are out of space, there's surely no point there
    if ((this.ox + this.hx < x) || (this.ox - this.hx > x) || (this.oy + this.hy < y) || (this.oy - this.hy > y) || (this.oz + this.hz < z) || (this.oz - this.hz > z)) 
	    return false;
	// if this is empty...
	if (this.data.length === 0) return false;
	// find the relevant node:
	// TODO: implement
}

Octree.prototype.nearestNeighbour = function(x, y, z) {
    // Since this gets coordinates, I'm assuming we want to return false if there's no point in this coordinates
	// TODO: implement

}

Octree.prototype._indexForPoint = function(x, y, z) {
    var ix = 0;
    if (x > this.ox) ix |= 1;
    if (y > this.oy) ix |= 2;
    if (z > this.oz) ix |= 4;
    return ix;
}

module.exports = function() {

    // TODO: configurable origin/size
    return new Octree(0, 0, 0, 1, 1, 1);

}
