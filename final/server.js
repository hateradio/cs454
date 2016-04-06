/*jslint indent: 2, maxerr: 50, node: true, vars: true, plusplus: true */
// FG - CS454

(function () {
  'use strict';

  var express = require('express');
  var request = require('request');
  var fs = require('fs');
  var app = express();

  app.use(express.static('./client'));

  app.get('/feeds/:name', function (req, res) {

    fs.readFile('./feeds/' + req.params.name + '.json', function (err, data) {
      if (!err) {

        try {
          var j = JSON.parse(data);
          res.json(j);
        } catch (e) {
          console.log(req.params.name + ' not found!');
        }

      } else {
        res.json(err);
      }
    });

    // res.json({error: true})
  });

  // Combines all the feeds
  app.get('/json', function (req, res) {

    var sites = ['google', 'arstechnica', 'reddit'];
    var feeds = [];
    var report = 0;

    function addFeed(feed) {
      // console.log(feed);

      if (feed && !feed.errno) {
        feeds = feeds.concat(feed);
      }

      report += 1;
      if (report === sites.length) {
        res.json(feeds);
      }
    }

    sites.forEach(function (site) {
      request('http://localhost:8080/feeds/' + site, function (err, resp, body) {
        // console.log(err, body);
        // res.json(body);
        var parse;
        try {
          parse = JSON.parse(body);
        } catch (e) {
          console.log(e);
        }

        addFeed(parse);
      });
    });


  });

  app.get('*', function (req, res) {
    res.json({note: "Please view the readme to use this site."});
  });

  app.listen(8080, function () {
    console.log('Server is running on 8080.');
  });

}());
