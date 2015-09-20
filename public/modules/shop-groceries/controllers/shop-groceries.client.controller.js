'use strict';

// Shop groceries controller
angular.module('shop-groceries').controller('ShopGroceriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'ShopGroceries',
	function($scope, $stateParams, $location, Authentication, ShopGroceries) {
		$scope.authentication = Authentication;

		// Create new Shop grocery
		$scope.create = function() {
			// Create new Shop grocery object
			var shopGrocery = new ShopGroceries ({
				name: this.name
			});

			// Redirect after save
			shopGrocery.$save(function(response) {
				$location.path('shop-groceries/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Shop grocery
		$scope.remove = function(shopGrocery) {
			if ( shopGrocery ) { 
				shopGrocery.$remove();

				for (var i in $scope.shopGroceries) {
					if ($scope.shopGroceries [i] === shopGrocery) {
						$scope.shopGroceries.splice(i, 1);
					}
				}
			} else {
				$scope.shopGrocery.$remove(function() {
					$location.path('shop-groceries');
				});
			}
		};

		// Update existing Shop grocery
		$scope.update = function() {
			var shopGrocery = $scope.shopGrocery;

			shopGrocery.$update(function() {
				$location.path('shop-groceries/' + shopGrocery._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Shop groceries
		$scope.find = function() {
			$scope.shopGroceries = ShopGroceries.query();
		};

		// Find existing Shop grocery
		$scope.findOne = function() {
			$scope.shopGrocery = ShopGroceries.get({ 
				shopGroceryId: $stateParams.shopGroceryId
			});
		};
	}
]);