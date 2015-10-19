/*jslint indent: 4, maxerr: 50, node: true */

var app = require('./app');
var yargs = require('yargs');

var flags = yargs.usage('$0: Usage node cli.js')
	.options('save', {
		describe: 'Save fact to facts.json'
	})
	.options('m', {
		alias: 'math',
		describe: 'Display math fact'
	})
	.options('t', {
		alias: 'trivia',
		describe: 'Display math trivia'
	})
	.options('d', {
		alias: 'date',
		describe: 'Display date fact'
	})
	.argv;

if (flags.help) {
	yargs.showHelp();
} else {
	app.run(flags);
}