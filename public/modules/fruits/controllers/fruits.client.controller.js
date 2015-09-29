'use strict';

// Fruits controller
angular.module('fruits').controller('FruitsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Fruits',
	function($scope, $stateParams, $location, Authentication, Fruits) {
		$scope.authentication = Authentication;

		// Create new Fruit
		$scope.create = function() {
			// Create new Fruit object
			var fruit = new Fruits ({
				name: this.name
			});

			// Redirect after save
			fruit.$save(function(response) {
				$location.path('fruits/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Fruit
		$scope.remove = function(fruit) {
			if ( fruit ) { 
				fruit.$remove();

				for (var i in $scope.fruits) {
					if ($scope.fruits [i] === fruit) {
						$scope.fruits.splice(i, 1);
					}
				}
			} else {
				$scope.fruit.$remove(function() {
					$location.path('fruits');
				});
			}
		};

		// Update existing Fruit
		$scope.update = function() {
			var fruit = $scope.fruit;

			fruit.$update(function() {
				$location.path('fruits/' + fruit._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Fruits
		$scope.find = function() {
			$scope.fruits = Fruits.query();
		};

		// Find existing Fruit
		$scope.findOne = function() {
			$scope.fruit = Fruits.get({ 
				fruitId: $stateParams.fruitId
			});
		};
	}
]);