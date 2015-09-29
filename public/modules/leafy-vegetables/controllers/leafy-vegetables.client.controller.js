'use strict';

// Leafy vegetables controller
angular.module('leafy-vegetables').controller('LeafyVegetablesController', ['$scope', '$stateParams', '$location', 'Authentication', 'LeafyVegetables',
	function($scope, $stateParams, $location, Authentication, LeafyVegetables) {
		$scope.authentication = Authentication;

		// Create new Leafy vegetable
		$scope.create = function() {
			// Create new Leafy vegetable object
			var leafyVegetable = new LeafyVegetables ({
				name: this.name
			});

			// Redirect after save
			leafyVegetable.$save(function(response) {
				$location.path('leafy-vegetables/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Leafy vegetable
		$scope.remove = function(leafyVegetable) {
			if ( leafyVegetable ) { 
				leafyVegetable.$remove();

				for (var i in $scope.leafyVegetables) {
					if ($scope.leafyVegetables [i] === leafyVegetable) {
						$scope.leafyVegetables.splice(i, 1);
					}
				}
			} else {
				$scope.leafyVegetable.$remove(function() {
					$location.path('leafy-vegetables');
				});
			}
		};

		// Update existing Leafy vegetable
		$scope.update = function() {
			var leafyVegetable = $scope.leafyVegetable;

			leafyVegetable.$update(function() {
				$location.path('leafy-vegetables/' + leafyVegetable._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Leafy vegetables
		$scope.find = function() {
			$scope.leafyVegetables = LeafyVegetables.query();
		};

		// Find existing Leafy vegetable
		$scope.findOne = function() {
			$scope.leafyVegetable = LeafyVegetables.get({ 
				leafyVegetableId: $stateParams.leafyVegetableId
			});
		};
	}
]);