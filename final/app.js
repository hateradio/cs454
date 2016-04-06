/*jslint indent: 2, maxerr: 50, node: true, vars: true, plusplus: true */
// FG - CS454

(function () {
  'use strict';

  var fs = require('fs');
  var request = require('request');
  var Parser;

  function Scrape(flags) {
    this.type = Scrape.detectType(flags); // rss for now
    this.flagLinks = flags[this.type];

    this.links = this.flagLinks.map(function (link) {
      var site = Scrape.WHITELIST.find(function (domain, id) {
        var index = link.indexOf(domain);
        // console.log(link, domain, index, id);
        return index !== -1 && Scrape.WHITELIST[id];
      });

      return site ? { site: site, link: link } : null;
    }).filter(function (i) { return i; });

    // console.log(this);
  }

  // http://feeds.arstechnica.com/arstechnica/index/
  // https://www.reddit.com/r/node/.rss
  Scrape.WHITELIST = ['google', 'arstechnica', 'reddit'];

  Scrape.DIR = 'feeds/';

  Scrape.detectType = function (flags) {
    if (flags.rss || flags.r) {
      return 'rss';
    }

    return null;
  };

  Scrape.request = {
    errorMsg: function () {
      console.log('Could not reach that link. Make sure it works.');
    }
  };

  Scrape.prototype.init = function () {
    if (this.isValid()) {

      this.links.forEach(function (l) { this.request(l.site, l.link); }, this);

    } else {
      this.invalidMessage();
    }
  };

  Scrape.prototype.isValid = function () {
    // console.info(this.type, this.links, typeof this.links);

    if (!this.type) {
      return false;
    }

    // console.log(this.links.length);
    if (this.links.length < 1) {
      return false;
    }

    return true;
  };

  Scrape.prototype.invalidMessage = function () {
    console.log('Please enter a valid flag! View help for more information.');
  };

  Scrape.prototype.request = function (site, uri) {
    var self = this;

    console.log('Requesting: ' + uri, 'from: ' + site);

    request(uri, function (error, response, body) {
      if (error) {
        Scrape.request.errorMsg();
      }

      if (response.statusCode === 200) {
        // console.log(body.slice(0, 20));
        var articles = new Parser(body).parse(site);
        self.write(site, articles);
      }
    });

  };

  Scrape.prototype.write = function (site, articles) {
    var prev = [],
      filename = Scrape.DIR + site + '.json';

    function newArticles() {
      return articles.filter(function (a) {
        return !prev.find(function (p) {
          return a.uri === p.uri;
        });
      });
    }

    function write(array) {
      var text = JSON.stringify(array, null, 2);

      fs.writeFile(filename, text, function (err) {
        if (err) {
          throw err;
        }

        // console.log('JSON\n', text);
        console.info('Saved: ' + filename);
      });
    }

    function read(err, txt) {
      if (!err) {
        // throw err;
        try {
          prev = JSON.parse(txt);
        } catch (e) {
          console.log('Creating articles file.');
        }
      }

      // console.log('prev.len', prev.length, newArticles());
      // return;

      var all = prev.concat(newArticles());

      write(all);
    }

    fs.readFile(filename, read);
  };

  module.exports.run = function (flags, $Parser) {
    // console.info('flags', flags);
    Parser = $Parser;
    var scrape = new Scrape(flags);
    scrape.init();
  };

}());
