'use strict';

// Personalcares controller
angular.module('personalcares').controller('PersonalcaresController', ['$scope', '$stateParams', '$location', 'Authentication', 'Personalcares',
	function($scope, $stateParams, $location, Authentication, Personalcares) {
		$scope.authentication = Authentication;

		// Create new Personalcare
		$scope.create = function() {
			// Create new Personalcare object
			var personalcare = new Personalcares ({
				name: this.name
			});

			// Redirect after save
			personalcare.$save(function(response) {
				$location.path('personalcares/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Personalcare
		$scope.remove = function(personalcare) {
			if ( personalcare ) { 
				personalcare.$remove();

				for (var i in $scope.personalcares) {
					if ($scope.personalcares [i] === personalcare) {
						$scope.personalcares.splice(i, 1);
					}
				}
			} else {
				$scope.personalcare.$remove(function() {
					$location.path('personalcares');
				});
			}
		};

		// Update existing Personalcare
		$scope.update = function() {
			var personalcare = $scope.personalcare;

			personalcare.$update(function() {
				$location.path('personalcares/' + personalcare._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Personalcares
		$scope.find = function() {
			$scope.personalcares = Personalcares.query();
		};

		// Find existing Personalcare
		$scope.findOne = function() {
			$scope.personalcare = Personalcares.get({ 
				personalcareId: $stateParams.personalcareId
			});
		};
	}
]);