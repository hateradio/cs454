/*jslint indent: 2, maxerr: 50, node: true */

var app = require('./app');
var yargs = require('yargs');

// scrape -rss http://site.com/rss -limit 10
// scrape -article http://site.com/articles/123

var flags = yargs.usage('$0: Usage node cli.js')
  .options('r', {
    alias: 'rss',
    describe: 'Grab articles from RSS feed',
    type: 'array'
  })
  .options('l', {
    alias: 'limit',
    describe: 'Limit number of articles'
  })
  .argv;

if (flags.help) {
  yargs.showHelp();
} else {
  var Parser = require('./parser').run(flags);
  app.run(flags, Parser);
}
