angular.module('search.service', [])
	.factory('SearchService', function ($resource) {
		return $resource('/api/show/search');
	});
