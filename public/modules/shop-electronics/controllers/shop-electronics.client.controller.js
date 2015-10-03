'use strict';

// Shop electronics controller
angular.module('shop-electronics').controller('ShopElectronicsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ShopElectronics',
	function($scope, $stateParams, $location, Authentication, ShopElectronics) {
		$scope.authentication = Authentication;

		// Create new Shop electronic
		$scope.create = function() {
			// Create new Shop electronic object
			var shopElectronic = new ShopElectronics ({
				name: this.name
			});

			// Redirect after save
			shopElectronic.$save(function(response) {
				$location.path('shop-electronics/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Shop electronic
		$scope.remove = function(shopElectronic) {
			if ( shopElectronic ) { 
				shopElectronic.$remove();

				for (var i in $scope.shopElectronics) {
					if ($scope.shopElectronics [i] === shopElectronic) {
						$scope.shopElectronics.splice(i, 1);
					}
				}
			} else {
				$scope.shopElectronic.$remove(function() {
					$location.path('shop-electronics');
				});
			}
		};

		// Update existing Shop electronic
		$scope.update = function() {
			var shopElectronic = $scope.shopElectronic;

			shopElectronic.$update(function() {
				$location.path('shop-electronics/' + shopElectronic._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Shop electronics
		$scope.find = function() {
			$scope.shopElectronics = ShopElectronics.query();
		};

		// Find existing Shop electronic
		$scope.findOne = function() {
			$scope.shopElectronic = ShopElectronics.get({ 
				shopElectronicId: $stateParams.shopElectronicId
			});
		};
	}
]);