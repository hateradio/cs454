/*jslint indent: 2, maxerr: 50, node: true, vars: true, plusplus: true */
// FG - CS454

(function () {
  'use strict';

  var xml = require('pixl-xml');
  var cheerio = require('cheerio');

  // Parse XML content
  function Parser(xmlBody) {
    this.doc = xml.parse(xmlBody, { lowerCase: true });
    // console.log(this.doc);
  }

  Parser.LIMIT = 10;

  // Strips HTML
  // <div>My <span>Text</span></div> => My Text
  Parser.removeHTML = function (html) {
    var $ = cheerio.load('<div id="_text">' + html + '</div>');
    var txt = $('#_text').text().replace('   [link] [comment]', '');
    return txt;
  };

  Parser.prototype.parse = function (site) {
    var i,
      items = this.doc.channel.item,
      limit = Math.min(Parser.LIMIT, items.length),
      item,
      articles = [];

    for (i = 0; i < limit; i++) {
      item = items[i];

      // if (i === 0) { console.log(item); }

      articles.push({
        'title': item.title,
        'uri': item.link,
        'summary': Parser.removeHTML(item.description),
        'date': item.pubdate,
        'scraped': new Date(),
        'site': site
      });
    }

    return articles;
  };

  module.exports.run = function (flags) {
    var limit = flags.l || flags.limit;
    Parser.LIMIT = 0 < limit && limit <= 20 ? limit : Parser.LIMIT;
    return Parser;
  };

}());
