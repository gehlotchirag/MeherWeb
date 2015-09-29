'use strict';

// Vegetables controller
angular.module('vegetables').controller('VegetablesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Vegetables',
	function($scope, $stateParams, $location, Authentication, Vegetables) {
		$scope.authentication = Authentication;

		// Create new Vegetable
		$scope.create = function() {
			// Create new Vegetable object
			var vegetable = new Vegetables ({
				name: this.name
			});

			// Redirect after save
			vegetable.$save(function(response) {
				$location.path('vegetables/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Vegetable
		$scope.remove = function(vegetable) {
			if ( vegetable ) { 
				vegetable.$remove();

				for (var i in $scope.vegetables) {
					if ($scope.vegetables [i] === vegetable) {
						$scope.vegetables.splice(i, 1);
					}
				}
			} else {
				$scope.vegetable.$remove(function() {
					$location.path('vegetables');
				});
			}
		};

		// Update existing Vegetable
		$scope.update = function() {
			var vegetable = $scope.vegetable;

			vegetable.$update(function() {
				$location.path('vegetables/' + vegetable._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Vegetables
		$scope.find = function() {
			$scope.vegetables = Vegetables.query();
		};

		// Find existing Vegetable
		$scope.findOne = function() {
			$scope.vegetable = Vegetables.get({ 
				vegetableId: $stateParams.vegetableId
			});
		};
	}
]);