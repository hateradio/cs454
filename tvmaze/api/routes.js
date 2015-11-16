var config = require('../config.json');
var superagent = require('superagent');

module.exports = function (app) {

  app.get('/api/show/search', function (req, res) {
    superagent
      .get(config.tvmaze.url + '/search/shows?q=' + req.query.name)
      .end(function (err, result) {
        console.log(err, result.body);
        res.json(result.body);
      });
  });

  app.get('/api/show/:id', function (req, res) {
    superagent
      .get(config.tvmaze.url + '/shows/' + req.params.id)
      .end(function (err, result) {
        res.json(result.body);
      });
  });

  app.get('/api/show/:id/cast', function (req, res) { // localhost:8080/api/show/8198/cast
    console.log('getting', config.tvmaze.url + '/shows/' + req.params.id + '/cast')
    superagent
      .get(config.tvmaze.url + '/shows/' + req.params.id + '/cast')
      .end(function (err, result) {
        console.log(result.body);
        res.json(result.body);
      });
  });

};
