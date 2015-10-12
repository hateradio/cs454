// FG - CS454

Array.prototype.flattenArray = function () {
	'use strict';

	return this.reduce(function (l, r) { return l.concat(r); });
};

var arrays = [[1, 2, 3], [4, 5], [6]];
console.log(arrays.flattenArray());
