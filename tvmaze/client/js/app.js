angular.module('app', [
    'ngRoute',
    'ngResource',
    'search.controller',
    'search.service',
    'show.controller',
    'show.service',
    'cast.service',
    'cast.controller'
  ])
  .filter('trustHTML', function ($sce) { // $sce service
    return function (html) {
      return $sce.trustAsHtml(html);
    };
  })
  .config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {

      $routeProvider
        .when('/', {
          templateUrl: 'views/search.html',
          controller: 'SearchController'
        })
        .when('/show/:id', {
          templateUrl: 'views/show.html',
          controller: 'ShowController',
          resolve: {
            show:function ($route, ShowService, CastService) {
              var shows = ShowService.get({
                id: $route.current.params.id
              }, function () {
                var cast = CastService.query({
                  id: $route.current.params.id
                }, function () {
                  shows.cast = cast;
                });
              });

              return shows;
            }
          }
        })
        .otherwise({
          redirectTo: '/'
        });

      $locationProvider.html5Mode(true);
  }]);
