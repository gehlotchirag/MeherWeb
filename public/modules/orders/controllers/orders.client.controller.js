'use strict';

// Orders controller
angular.module('orders').controller('OrdersController', ['$scope','$stateParams', '$location', 'Authentication', 'Orders','$http','NgMap',
	function($scope, $stateParams, $location, Authentication, Orders,$http,NgMap) {
		$scope.authentication = Authentication;

    $scope.showMap = false;

		// Create new Order
		$scope.create = function() {
			// Create new Order object
			var order = new Orders ({
				name: this.name
			});

			// Redirect after save
			order.$save(function(response) {
				$location.path('orders/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Order
		$scope.remove = function(order) {
			if ( order ) { 
				order.$remove();

				for (var i in $scope.orders) {
					if ($scope.orders [i] === order) {
						$scope.orders.splice(i, 1);
					}
				}
			} else {
				$scope.order.$remove(function() {
					$location.path('orders');
				});
			}
		};

    $scope.renderMap = function(order){

      console.log("https://maps.googleapis.com/maps/api/geocode/json?address="+order.customer.addLine2);
      $scope.customerPlace = order.customer.addLine2;
      $http.get("https://maps.googleapis.com/maps/api/geocode/json?address="+order.customer.addLine2).
      then(function (response) {
        order.latitude = (response.data.results[0].geometry.location.lat);
        order.longitude = (response.data.results[0].geometry.location.lng);
        console.log(order.latitude+" ***"+order.longitude)

        order.location = [order.latitude,order.longitude];
        console.log(order.location)
        order.showMap = !order.showMap;
        $scope.listNearBy(order);
        //NgMap.getMap().then(function(map) {
        //  console.log(map)
        //  //map.setCenter(order.latitude,order.longitude)
        //  console.log(map.getCenter());
        //  console.log('markers', map.markers);
        //  console.log('shapes', map.shapes);
        //});


      }, function (response) {
        console.log("error")
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });


      $scope.listNearBy = function (order) {
        var category = order.store.category;
        console.log(category);

        console.log(order.latitude)
        var routename = "";
        if(category == 'Fruits')
          routename = "shop-fruits";
        if(category == 'Electronics')
          routename= 'shop-electronics';
        if(category == 'Grocery')
          routename= 'shop-groceries';
        if(category == 'Medical')
          routename= 'shop-medicals';
        $http.get('http://getmeher.com:3000/'+routename+'/near/' +  order.longitude+ '/' + order.latitude + '/1').
        then(function (response) {
          $scope.shopsNearBy = (response.data);
        }, function (response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
      }


    }
		// Update existing Order
		$scope.update = function() {
			var order = $scope.order;

			order.$update(function() {
				$location.path('orders/' + order._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Orders
		$scope.find = function() {
			$scope.orders = Orders.query();
		};

		// Find existing Order
		$scope.findOne = function() {
			$scope.order = Orders.get({ 
				orderId: $stateParams.orderId
			});
		};
	}
]);
