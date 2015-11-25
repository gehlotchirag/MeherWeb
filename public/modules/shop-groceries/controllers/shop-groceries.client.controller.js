'use strict';

// Shop groceries controller
angular.module('shop-groceries').controller('ShopGroceriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'ShopGroceries','$http',
	function($scope, $stateParams, $location, Authentication, ShopGroceries,$http) {
		$scope.authentication = Authentication;
    $scope.openalldays = true;
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

    $scope.findNearby = function() {
      //$scope.shopGroceries = ShopGroceries.query();
      $scope.pageNumber = 0;
      console.log($scope.areaLocation);
      if ($scope.areaLocation) {
        $scope.areaLng = $scope.areaLocation.geometry.location.lng();
        $scope.areaLat = $scope.areaLocation.geometry.location.lat();
      }
      else{
        $scope.areaLng = 71;
        $scope.areaLat = 19;
      }
        $scope.pageNumber = 1;
        console.log($scope.pageNumber);
        $http.get('http://getmeher.com:3000/shop-groceries/near/' + $scope.areaLng + '/' + $scope.areaLat + '/' + $scope.pageNumber).
            then(function (response) {
              $scope.shopGroceries = (response.data);
              $scope.$broadcast('scroll.infiniteScrollComplete');
            }, function (response) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });
    };

    $scope.loadmore = function() {
      //$scope.shopGroceries = ShopGroceries.query();
      console.log($scope.areaLocation);
      if ($scope.areaLocation) {
        $scope.areaLng = $scope.areaLocation.geometry.location.lng();
        $scope.areaLat = $scope.areaLocation.geometry.location.lat();
      }
      else{
        $scope.areaLng = 71;
        $scope.areaLat = 19;
      }
      $scope.pageNumber = $scope.pageNumber + 1;
      console.log($scope.pageNumber);
      $http.get('http://getmeher.com:3000/shop-groceries/near/' + $scope.areaLng + '/' + $scope.areaLat + '/' + $scope.pageNumber).
          then(function (response) {
            $scope.shopGroceries = (response.data);
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }, function (response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
    };


    $scope.updateSpecific = function(shopGroceryData) {
      var shopGrocery = shopGroceryData;
      console.log(shopGrocery);
      shopGrocery.pushUpdates(function() {
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
