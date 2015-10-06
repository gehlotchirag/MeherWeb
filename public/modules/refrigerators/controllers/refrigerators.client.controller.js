'use strict';

// Refrigerators controller
angular.module('refrigerators').controller('RefrigeratorsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Refrigerators',
	function($scope, $stateParams, $location, Authentication, Refrigerators) {
		$scope.authentication = Authentication;

		// Create new Refrigerator
		$scope.create = function() {
			// Create new Refrigerator object
			var refrigerator = new Refrigerators ({
				name: this.name
			});

			// Redirect after save
			refrigerator.$save(function(response) {
				$location.path('refrigerators/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Refrigerator
		$scope.remove = function(refrigerator) {
			if ( refrigerator ) { 
				refrigerator.$remove();

				for (var i in $scope.refrigerators) {
					if ($scope.refrigerators [i] === refrigerator) {
						$scope.refrigerators.splice(i, 1);
					}
				}
			} else {
				$scope.refrigerator.$remove(function() {
					$location.path('refrigerators');
				});
			}
		};

		// Update existing Refrigerator
		$scope.update = function() {
			var refrigerator = $scope.refrigerator;

			refrigerator.$update(function() {
				$location.path('refrigerators/' + refrigerator._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Refrigerators
		$scope.find = function() {
			$scope.refrigerators = Refrigerators.query();
		};

		// Find existing Refrigerator
		$scope.findOne = function() {
			$scope.refrigerator = Refrigerators.get({ 
				refrigeratorId: $stateParams.refrigeratorId
			});
		};
	}
]);