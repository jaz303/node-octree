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

module.exports = function() {

    // TODO: configurable origin/size
    return new Octree(0, 0, 0, 1, 1, 1);

}