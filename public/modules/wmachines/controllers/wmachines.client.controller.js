'use strict';

// Wmachines controller
angular.module('wmachines').controller('WmachinesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Wmachines',
	function($scope, $stateParams, $location, Authentication, Wmachines) {
		$scope.authentication = Authentication;

		// Create new Wmachine
		$scope.create = function() {
			// Create new Wmachine object
			var wmachine = new Wmachines ({
				name: this.name
			});

			// Redirect after save
			wmachine.$save(function(response) {
				$location.path('wmachines/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Wmachine
		$scope.remove = function(wmachine) {
			if ( wmachine ) { 
				wmachine.$remove();

				for (var i in $scope.wmachines) {
					if ($scope.wmachines [i] === wmachine) {
						$scope.wmachines.splice(i, 1);
					}
				}
			} else {
				$scope.wmachine.$remove(function() {
					$location.path('wmachines');
				});
			}
		};

		// Update existing Wmachine
		$scope.update = function() {
			var wmachine = $scope.wmachine;

			wmachine.$update(function() {
				$location.path('wmachines/' + wmachine._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Wmachines
		$scope.find = function() {
			$scope.wmachines = Wmachines.query();
		};

		// Find existing Wmachine
		$scope.findOne = function() {
			$scope.wmachine = Wmachines.get({ 
				wmachineId: $stateParams.wmachineId
			});
		};
	}
]);