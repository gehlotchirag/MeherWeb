'use strict';

// Tvs controller
angular.module('tvs').controller('TvsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tvs',
	function($scope, $stateParams, $location, Authentication, Tvs) {
		$scope.authentication = Authentication;

		// Create new Tv
		$scope.create = function() {
			// Create new Tv object
			var tv = new Tvs ({
				name: this.name
			});

			// Redirect after save
			tv.$save(function(response) {
				$location.path('tvs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Tv
		$scope.remove = function(tv) {
			if ( tv ) { 
				tv.$remove();

				for (var i in $scope.tvs) {
					if ($scope.tvs [i] === tv) {
						$scope.tvs.splice(i, 1);
					}
				}
			} else {
				$scope.tv.$remove(function() {
					$location.path('tvs');
				});
			}
		};

		// Update existing Tv
		$scope.update = function() {
			var tv = $scope.tv;

			tv.$update(function() {
				$location.path('tvs/' + tv._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Tvs
		$scope.find = function() {
			$scope.tvs = Tvs.query();
		};

		// Find existing Tv
		$scope.findOne = function() {
			$scope.tv = Tvs.get({ 
				tvId: $stateParams.tvId
			});
		};
	}
]);