angular.module('cast.service', [])
	.factory('CastService', function ($resource) {
		return $resource('/api/show/:id/cast');
	});
