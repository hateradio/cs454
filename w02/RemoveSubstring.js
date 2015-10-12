// FG - CS454

String.prototype.removeSubstring = function (rem, num) {
	'use strict';

	num = parseInt(num, 10);

	if (num) {
		return this.replace(new RegExp(rem + '{' + num + '}', 'g'), '');
	}

	return this.replace(new RegExp(rem, 'g'), '');

};

var str1 = 'aaa';
var newStr1 = str1.removeSubstring('a', 2); // newStr = 'a'
console.log(newStr1);
var str2 = 'aaabbbb';
var newStr2 = str2.removeSubstring('a'); // newStr = 'bbbb'
