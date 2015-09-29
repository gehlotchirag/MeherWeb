'use strict';

// Sprouts vegetables controller
angular.module('sprouts-vegetables').controller('SproutsVegetablesController', ['$scope', '$stateParams', '$location', 'Authentication', 'SproutsVegetables',
	function($scope, $stateParams, $location, Authentication, SproutsVegetables) {
		$scope.authentication = Authentication;

		// Create new Sprouts vegetable
		$scope.create = function() {
			// Create new Sprouts vegetable object
			var sproutsVegetable = new SproutsVegetables ({
				name: this.name
			});

			// Redirect after save
			sproutsVegetable.$save(function(response) {
				$location.path('sprouts-vegetables/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Sprouts vegetable
		$scope.remove = function(sproutsVegetable) {
			if ( sproutsVegetable ) { 
				sproutsVegetable.$remove();

				for (var i in $scope.sproutsVegetables) {
					if ($scope.sproutsVegetables [i] === sproutsVegetable) {
						$scope.sproutsVegetables.splice(i, 1);
					}
				}
			} else {
				$scope.sproutsVegetable.$remove(function() {
					$location.path('sprouts-vegetables');
				});
			}
		};

		// Update existing Sprouts vegetable
		$scope.update = function() {
			var sproutsVegetable = $scope.sproutsVegetable;

			sproutsVegetable.$update(function() {
				$location.path('sprouts-vegetables/' + sproutsVegetable._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Sprouts vegetables
		$scope.find = function() {
			$scope.sproutsVegetables = SproutsVegetables.query();
		};

		// Find existing Sprouts vegetable
		$scope.findOne = function() {
			$scope.sproutsVegetable = SproutsVegetables.get({ 
				sproutsVegetableId: $stateParams.sproutsVegetableId
			});
		};
	}
]);