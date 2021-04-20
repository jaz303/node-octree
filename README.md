# octree

## What is an octree?

An octree is a tree data structure in which each internal node has exactly
eight children. Octrees are most often used to partition a three dimensional
space by recursively subdividing it into eight octants. Octrees are the
three-dimensional analog of quadtrees. The name is formed from oct + tree, but
note that it is normally written "octree" with only one "t". Octrees are often
used in 3D graphics and 3D game engines.

You can read more about it at http://en.wikipedia.org/wiki/Octree .

## What is octree?

octree is a Javascript library that implements octrees. With it, you'll be
able to create, modify and browse an octree.

### Usage

	var inspect = require('util').inspect;
	var octree = require('octree'); // library load
	var mytree = octree(); // create an octree, center 0,0,0 and size 1,1,1
	mytree.insert(0,0,0,"center");  // insert object (in this case a string) on coordinates 0,0,0 (x,y,z)
	mytree.insert(-0.1,0,0,"west");
	mytree.insert(0.1,0,0,"east");
	mytree.insert(0.1,0.3,0.4,"somewhere");
	mytree.insert(0.2,0.3,0.4,"somewhere");
	mytree.insert(0.3,0.3,0.4,"somewhere");
	mytree.insert(0.4,0.3,0.4,"somewhere");
	mytree.insert(0.1,0.4,0.4,"somewhere");
	mytree.insert(0.2,0.4,0.4,"somewhere");
	mytree.insert(0.3,0.4,0.4,"somewhere");
	mytree.insert(-1,-1,-1,"far away"); // actually, a corner
	console.log(inspect(mytree, {colors: true, depth: null})); // let's see our octree...
