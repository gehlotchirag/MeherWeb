'use strict';

// Mobiles controller
angular.module('mobiles').controller('MobilesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Mobiles',
	function($scope, $stateParams, $location, Authentication, Mobiles) {
		$scope.authentication = Authentication;

		// Create new Mobile
		$scope.create = function() {
			// Create new Mobile object
			var mobile = new Mobiles ({
				name: this.name
			});

			// Redirect after save
			mobile.$save(function(response) {
				$location.path('mobiles/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Mobile
		$scope.remove = function(mobile) {
			if ( mobile ) { 
				mobile.$remove();

				for (var i in $scope.mobiles) {
					if ($scope.mobiles [i] === mobile) {
						$scope.mobiles.splice(i, 1);
					}
				}
			} else {
				$scope.mobile.$remove(function() {
					$location.path('mobiles');
				});
			}
		};

		// Update existing Mobile
		$scope.update = function() {
			var mobile = $scope.mobile;

			mobile.$update(function() {
				$location.path('mobiles/' + mobile._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Mobiles
		$scope.find = function() {
			$scope.mobiles = Mobiles.query();
		};

		// Find existing Mobile
		$scope.findOne = function() {
			$scope.mobile = Mobiles.get({ 
				mobileId: $stateParams.mobileId
			});
		};
	}
]);