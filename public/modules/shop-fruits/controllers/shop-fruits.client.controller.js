'use strict';

// Shop fruits controller
angular.module('shop-fruits').controller('ShopFruitsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ShopFruits','$http','$state',
	function($scope, $stateParams, $location, Authentication, ShopFruits, $http, $state) {
		$scope.authentication = Authentication;
		$scope.openalldays = true;
		$scope.changenumber = false;

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
        $http({
          method: 'DELETE',
          data: shopFruit,
          url: 'http://getmeher.com:3000/shop-fruits/' + shopFruit._id
        }).then(function successCallback(response) {
          console.log(response)
          alert("removed");
          for (var i in $scope.shopFruits) {
            if ($scope.shopFruits [i] === shopFruit) {
              $scope.shopFruits.splice(i, 1);
            }
          }
        }, function errorCallback(response) {
          console.log(response)
          alert("error" + response);
        });
      }
    };


    //$scope.removeSpecific = function(shopFruit) {
    //  if(confirm('Please Explain about App before Deleting')) {
    //    if (shopFruit) {
    //      shopFruit.$remove();
    //      for (var i in $scope.shopFruits) {
    //        if ($scope.shopFruits [i] === shopFruit) {
    //          $scope.shopFruits.splice(i, 1);
    //        }
    //      }
    //    } else {
    //      $scope.shopFruit.$remove(function () {
    //        $location.path('shop-groceries');
    //      });
    //    }
    //  }
    //};


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
				//$location.path('shop-fruits/' + shopFruit._id);
				$location.path('reminders/');
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
      $http.get('http://getmeher.com:3000/shop-fruits/near/' + $scope.areaLng + '/' + $scope.areaLat + '/' + $scope.pageNumber).
          then(function (response) {
            $scope.shopFruits = (response.data);
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }, function (response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
    };

    $scope.setReminder = function(shopFruitData){
      shopFruitData.url = $state.current.url;
      $scope.reminderPost = {
        store: shopFruitData,
        shopName: shopFruitData.name,
        url: shopFruitData.url,
        address: shopFruitData.address,
        mobile: shopFruitData.mobile,
        notes: shopFruitData.notes
      };
      $http({
        url: 'http://getmeher.com:3000/reminders',
        method: "POST",
        data: $scope.reminderPost
      }).then(function(response) {
            // success
            alert("Reminder Set");
            console.log(response);
          },
          function(response) { // optional
            // failed
            $scope.reminderPost = null;
            console.log(response);
          });
    };

    $scope.updateSpecific = function(shopFruitData) {
      console.log(shopFruitData);
      if (shopFruitData) {
        if (shopFruitData.tempMobile)
          shopFruitData.mobile = shopFruitData.tempMobile;
        var shopFruit = shopFruitData;
        console.log(shopFruit);
        $http({
          method: 'PUT',
          data: shopFruitData,
          url: 'http://getmeher.com:3000/shop-fruits/' + shopFruitData._id
        }).then(function successCallback(response) {
          console.log(response)
          alert("updates saved")
        }, function errorCallback(response) {
          console.log(response)
          alert("error" + response);
        });
      }
      else{
        alert("Please Tick tie up!")
      }

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
