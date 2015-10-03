'use strict';

// Shop fruits controller
angular.module('shop-fruits').controller('ShopFruitsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ShopFruits',
	function($scope, $stateParams, $location, Authentication, ShopFruits) {
		$scope.authentication = Authentication;

		// Create new Shop fruit
		$scope.create = function() {
			// Create new Shop fruit object
			var shopFruit = new ShopFruits ({
				name: this.name
			});

			// Redirect after save
			shopFruit.$save(function(response) {
				$location.path('shop-fruits/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Shop fruit
		$scope.remove = function(shopFruit) {
			if ( shopFruit ) { 
				shopFruit.$remove();

				for (var i in $scope.shopFruits) {
					if ($scope.shopFruits [i] === shopFruit) {
						$scope.shopFruits.splice(i, 1);
					}
				}
			} else {
				$scope.shopFruit.$remove(function() {
					$location.path('shop-fruits');
				});
			}
		};

		// Update existing Shop fruit
		$scope.update = function() {
			var shopFruit = $scope.shopFruit;

			shopFruit.$update(function() {
				$location.path('shop-fruits/' + shopFruit._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Shop fruits
		$scope.find = function() {
			$scope.shopFruits = ShopFruits.query();
		};

		// Find existing Shop fruit
		$scope.findOne = function() {
			$scope.shopFruit = ShopFruits.get({ 
				shopFruitId: $stateParams.shopFruitId
			});
		};
	}
]);