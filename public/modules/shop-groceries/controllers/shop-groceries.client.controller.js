'use strict';

// Shop groceries controller
angular.module('shop-groceries').controller('ShopGroceriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'ShopGroceries',
	function($scope, $stateParams, $location, Authentication, ShopGroceries) {
		$scope.authentication = Authentication;
    $scope.openalldays = true;
    //$scope.shopGrocery={};
    //$scope.shopGrocery.deliveryDistance=1;
    //$scope.shopGrocery = {appDownloaded:false,deliveryDistance:"1",deliveryTime:"30",startTime:"9",closeTime:"10"};
    //$scope.shopGrocery = {};
    //$scope.shopGrocery = {deliveryDistance:"1",x:"1"};
    //alert($scope.shopGrocery.deliveryDistance);

    //$scope.isCollapsed = false;
    //$scope.shopGrocery.isCollapsed
    //$scope.shopGrocery.deliveryDistance = 1;
    //$scope.shopGrocery ={};
    $scope.days = [
      {name: 'Sunday' },
      {  name: 'Monday' },
      { name: 'Tuesday' }
    ];

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
    // Remove existing Shop grocery
    $scope.removeSpecific = function(shopGrocery) {
      if(confirm('Please Explain about App before Deleting')) {
        if (shopGrocery) {
          shopGrocery.$remove();
          for (var i in $scope.shopGroceries) {
            if ($scope.shopGroceries [i] === shopGrocery) {
              $scope.shopGroceries.splice(i, 1);
            }
          }
        } else {
          $scope.shopGrocery.$remove(function () {
            $location.path('shop-groceries');
          });
        }
      }
    };

		// Update existing Shop grocery
		$scope.update = function() {
			var shopGrocery = $scope.shopGrocery;
console.log(shopGrocery);
			shopGrocery.$update(function() {
				$location.path('shop-groceries/' + shopGrocery._id);
        alert("Saved!");
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Shop groceries
		$scope.find = function() {
			$scope.shopGroceries = ShopGroceries.query();
		};

    $scope.updateSpecific = function(shopGroceryData) {
      var shopGrocery = shopGroceryData;
      console.log(shopGrocery);
      shopGrocery.$update(function() {
        //$location.path('shop-groceries/' + shopGrocery._id);
        alert("Saved!");
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find existing Shop grocery
    $scope.findSpecific = function(shopGroceryId) {
      alert("Fetching");
      $scope.shopGrocery = ShopGroceries.get({
        shopGroceryId: shopGroceryId
      });
    };

    $scope.findOne = function() {
			$scope.shopGrocery = ShopGroceries.get({ 
				shopGroceryId: $stateParams.shopGroceryId
			});
      console.log($scope.shopGrocery)
		};
	}
]);
