angular.module('app', [
    'ngRoute',
    'ngResource',
    'search.controller',
    'search.service',
    'show.controller',
    'show.service'
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
            show:function ($route, ShowService) {
              return ShowService.get({ id: $route.current.params.id });
            }
          }
        })
        .otherwise({
          redirectTo: '/'
        });

      $locationProvider.html5Mode(true);
  }]);
