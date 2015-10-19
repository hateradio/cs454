/*jslint indent: 4, maxerr: 50, node: true, vars: true */
// FG - CS454

(function () {

	'use strict';

	var fs = require('fs');
	var superagent = require('superagent');

	function MathApp(flags) {
		this.type = this.detectType(flags);
		this.number = flags[this.type];
		this.save = !!flags.save;
	}

	MathApp.prototype.init = function () {
		// console.info('this: ', this);
		if (this.isValid()) {
			this.request();
		} else {
			this.invalidMessage();
		}
	};

	MathApp.prototype.isValid = function () {
		// console.info(typeof this.number);

		if (!this.type) { return false; }

		if (this.type === 'date' && typeof this.number === 'string') {
			this.number = this.number.trim();
			return this.number.indexOf('/') !== -1;
		}

		if (typeof this.number === 'number') {
			return true;
		}
	};

	MathApp.prototype.detectType = function (flags) {
		if (flags.m || flags.math) {
			return 'math';
		}

		if (flags.t || flags.trivia) {
			return 'trivia';
		}

		if (flags.d || flags.date) {

			if (!isNaN(flags.d)) {
				flags.year = flags.y = flags.d;
				return 'year';
			}

			return 'date';
		}

		return null;
	};

	/** Date to Sun Oct 11 2015 15:25:19 GMT-0700 (PDT) */
	MathApp.prototype.dateFormat = function (date) {
		// get the time zone, eg, (Pacific Daylight Time)
		date = date.toString();
		var zone = date.match(/\([A-Z\s]+\)/i)[0];

		// Replace the time zone with only the upper case characters, eg, (PDT)
		return date.replace(zone, zone.replace(/[a-z+\s]/g, ''));
	};

	MathApp.prototype.write = function (text, found) {
		var filename = 'facts.json',
			prev = [],
			data = {
				text: text,
				number: this.number,
				found: found,
				type: this.type,
				saved: this.dateFormat(new Date())
			};

		function write(array) {
			var text = JSON.stringify(array, null, 2);

			fs.writeFile(filename, text, function (err) {
				if (err) {
					throw err;
				}

				console.log('facts.json\n', text);
				// console.info('File Saved!');
			});
		}

		function read(err, txt) {
			if (err) {
				throw err;
			}

			try { prev = JSON.parse(txt); } catch (e) {}

			prev.push(data);
			write(prev);
		}

		fs.readFile(filename, read);
	};

	MathApp.prototype.request = function () {
		var uri = 'http://numbersapi.com/' + this.number + '/' + this.type,
			self = this;

		// console.info(uri);

		function request(err, response) {
			if (err) {
				throw err;
			}

			console.log(self.type + ': ' + response.text);

			if (self.save) {
				self.write(response.text, true);
			}
		}

		superagent.get(uri).end(request);
	};

	MathApp.prototype.invalidMessage = function () {
		console.log('Please enter a valid flag! View help for more information.');
	};

	module.exports.run = function (flags) {
		// console.info('flags', flags);
		var math = new MathApp(flags);
		math.init();
	};


}());
