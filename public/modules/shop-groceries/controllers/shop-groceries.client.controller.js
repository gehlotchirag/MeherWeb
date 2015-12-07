'use strict';

// Shop groceries controller
angular.module('shop-groceries').controller('ShopGroceriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'ShopGroceries','$http','$state',
	function($scope, $stateParams, $location, Authentication, ShopGroceries,$http,$state) {
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

    $scope.removeSpecific = function(shopGrocery) {
      if(confirm('Please Explain about App before Deleting')) {
        $http({
          method: 'DELETE',
          data: shopGrocery,
          url: 'http://getmeher.com:3000/shop-groceries/' + shopGrocery._id
        }).then(function successCallback(response) {
          console.log(response)
          alert("removed");
          for (var i in $scope.shopGrocerys) {
            if ($scope.shopGrocerys [i] === shopGrocery) {
              $scope.shopGrocerys.splice(i, 1);
            }
          }
        }, function errorCallback(response) {
          console.log(response)
          alert("error" + response);
        });
      }
    };

    // Remove existing Shop grocery
    //$scope.removeSpecific = function(shopGrocery) {
    //  if(confirm('Please Explain about App before Deleting')) {
    //    if (shopGrocery) {
    //      shopGrocery.$remove();
    //      for (var i in $scope.shopGroceries) {
    //        if ($scope.shopGroceries [i] === shopGrocery) {
    //          $scope.shopGroceries.splice(i, 1);
    //        }
    //      }
    //    } else {
    //      $scope.shopGrocery.$remove(function () {
    //        $location.path('shop-groceries');
    //      });
    //    }
    //  }
    //};

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

    $scope.sendDownloadSMS = function(shopGroceryData,event){
      event.preventDefault();
      //var SmsText = "Thanks for registering with Meher. Get more orders in your Area. Download Meher Now. "+"\n"+ "Retailer App https://goo.gl/HzI82z"+"\n"+"Customer App https://goo.gl/cxqKEc";

      var SmsText = "Thanks for registering with Meher. Get more orders from nearby buildings/societies. Download App Now: https://goo.gl/HzI82z (on Android Play Store)";
      var number = shopGroceryData.mobile;
      $http({
        url: 'http://api.smscountry.com/SMSCwebservice_bulk.aspx?',
        method: "POST",
        params: {
          User:"mehertech",
          passwd:"developer007",
          mobilenumber: number,
          message: SmsText,
          sid:"mehera",
          mtype:"N",
          DR:"Y"
        }
      }).then(function(response) {
            // success
            alert("SMS Send");
            console.log(response);
          },
          function(response) { // optional
            // failed
            $scope.downloadSMS = null;
            console.log(response);
          });
    };
    $scope.setReminder = function(shopGroceryData){
      shopGroceryData.url = $state.current.url;
      $scope.reminderPost = {
        store: shopGroceryData,
        shopName: shopGroceryData.name,
        url: shopGroceryData.url,
        address: shopGroceryData.address,
        mobile: shopGroceryData.mobile,
        notes: shopGroceryData.notes
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
    $scope.updateSpecific = function(shopGroceryData) {
      shopGroceryData.url = $state.current.url;
      var callLogData = {
        store: shopGroceryData,
        notes:shopGroceryData.notes,
        address:shopGroceryData.address,
        url:shopGroceryData.url
      };
      console.log(shopGroceryData);
      if (shopGroceryData.verified) {
        if (shopGroceryData.tempMobile)
          shopGroceryData.mobile = shopGroceryData.tempMobile;
        var shopGrocery = shopGroceryData;
        console.log(shopGrocery);
        $http({
          method: 'PUT',
          data: shopGroceryData,
          url: 'http://getmeher.com:3000/shop-groceries/' + shopGroceryData._id
        }).then(function successCallback(response) {
          console.log(response)
          //alert("updates saved");
          $http({
            method: 'POST',
            data: callLogData,
            url: 'http://getmeher.com:3000/calldetails/'
          }).then(function successCallback(response) {
            console.log(response);
            alert("updates saved");
          }, function errorCallback(response) {
            console.log(response);
            console.log("error" + response);
            alert("updates saved");
          });

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
