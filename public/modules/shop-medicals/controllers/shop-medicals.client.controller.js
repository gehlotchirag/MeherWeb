'use strict';

// Shop medicals controller
angular.module('shop-medicals').controller('ShopMedicalsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ShopMedicals',
	function($scope, $stateParams, $location, Authentication, ShopMedicals) {
		$scope.authentication = Authentication;

		// Create new Shop medical
		$scope.create = function() {
			// Create new Shop medical object
			var shopMedical = new ShopMedicals ({
				name: this.name
			});

			// Redirect after save
			shopMedical.$save(function(response) {
				$location.path('shop-medicals/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Shop medical
		$scope.remove = function(shopMedical) {
			if ( shopMedical ) { 
				shopMedical.$remove();

				for (var i in $scope.shopMedicals) {
					if ($scope.shopMedicals [i] === shopMedical) {
						$scope.shopMedicals.splice(i, 1);
					}
				}
			} else {
				$scope.shopMedical.$remove(function() {
					$location.path('shop-medicals');
				});
			}
		};

		// Update existing Shop medical
		$scope.update = function() {
			var shopMedical = $scope.shopMedical;

			shopMedical.$update(function() {
				$location.path('shop-medicals/' + shopMedical._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Shop medicals
		$scope.find = function() {
			$scope.shopMedicals = ShopMedicals.query();
		};

		// Find existing Shop medical
		$scope.findOne = function() {
			$scope.shopMedical = ShopMedicals.get({ 
				shopMedicalId: $stateParams.shopMedicalId
			});
		};
	}
]);