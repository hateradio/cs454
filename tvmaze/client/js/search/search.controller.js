angular.module('search.controller', [])
	.directive('showPreview', function () {
		return {
			restrict: 'A',
			scope: {
				show: '=' // two-way data binding
			},
			templateUrl: '../views/show.preview.html'
		};
	})
	.controller('SearchController', function ($scope, SearchService) {
		$scope.search = function () {
			SearchService.query({ name: $scope.name }, function (response) {
				$scope.shows = response;
			});
		};
});
