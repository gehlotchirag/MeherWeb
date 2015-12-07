'use strict';

// Calldetails controller
angular.module('calldetails').controller('CalldetailsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Calldetails',
	function($scope, $stateParams, $location, Authentication, Calldetails) {
		$scope.authentication = Authentication;

		// Create new Calldetail
		$scope.create = function() {
			// Create new Calldetail object
			var calldetail = new Calldetails ({
				name: this.name
			});

			// Redirect after save
			calldetail.$save(function(response) {
				$location.path('calldetails/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

    $scope.gotoStores = function (calldetail){
      console.log(calldetail)
      $location.path(calldetail.url +"/"+ calldetail.store._id +"/edit");
    };

		// Remove existing Calldetail
		$scope.remove = function(calldetail) {
			if ( calldetail ) { 
				calldetail.$remove();

				for (var i in $scope.calldetails) {
					if ($scope.calldetails [i] === calldetail) {
						$scope.calldetails.splice(i, 1);
					}
				}
			} else {
				$scope.calldetail.$remove(function() {
					$location.path('calldetails');
				});
			}
		};

		// Update existing Calldetail
		$scope.update = function() {
			var calldetail = $scope.calldetail;

			calldetail.$update(function() {
				$location.path('calldetails/' + calldetail._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Calldetails
		$scope.find = function() {
			$scope.calldetails = Calldetails.query();
		};

		// Find existing Calldetail
		$scope.findOne = function() {
			$scope.calldetail = Calldetails.get({ 
				calldetailId: $stateParams.calldetailId
			});
		};
	}
]);
