'use strict';

// Shop fruits controller
angular.module('shop-fruits').controller('ShopFruitsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ShopFruits','$http',
	function($scope, $stateParams, $location, Authentication, ShopFruits, $http) {
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
    
    $scope.removeSpecific = function(shopFruit) {
      if(confirm('Please Explain about App before Deleting')) {
        if (shopFruit) {
          shopFruit.$remove();
          for (var i in $scope.shopFruits) {
            if ($scope.shopFruits [i] === shopFruit) {
              $scope.shopFruits.splice(i, 1);
            }
          }
        } else {
          $scope.shopFruit.$remove(function () {
            $location.path('shop-groceries');
          });
        }
      }
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

    $scope.findNearby = function() {
      //$scope.shopFruits = shopFruits.query();
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
      $http.get('http://getmeher.com:3000/shop-fruits/near/' + $scope.areaLng + '/' + $scope.areaLat + '/' + $scope.pageNumber).
          then(function (response) {
            $scope.shopFruits = (response.data);
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }, function (response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
    };

    $scope.loadmore = function() {
      //$scope.shopFruits = shopFruits.query();
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
            $scope.shopFruits = (response.data);
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }, function (response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
    };


    $scope.updateSpecific = function(shopFruitData) {
      var shopFruit = shopFruitData;
      console.log(shopFruit);
      shopFruit.pushUpdates(function() {
        //$location.path('shop-groceries/' + shopFruit._id);
        alert("Saved!");
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find existing Shop grocery
    $scope.findSpecific = function(shopFruitId) {
      alert("Fetching");
      $scope.shopFruit = shopFruits.get({
        shopFruitId: shopFruitId
      });
    };

    // Find existing Shop fruit
		$scope.findOne = function() {
			$scope.shopFruit = ShopFruits.get({ 
				shopFruitId: $stateParams.shopFruitId
			});
		};
	}
]);
