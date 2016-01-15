'use strict';

// Offers controller
angular.module('offers').controller('OffersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Offers',
	function($scope, $stateParams, $location, Authentication, Offers) {
		$scope.authentication = Authentication;

		// Create new Offer
		$scope.create = function() {
			// Create new Offer object
			var offer = new Offers ({
				name: this.name
			});

			// Redirect after save
			offer.$save(function(response) {
				$location.path('offers/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Offer
		$scope.remove = function(offer) {
			if ( offer ) { 
				offer.$remove();

				for (var i in $scope.offers) {
					if ($scope.offers [i] === offer) {
						$scope.offers.splice(i, 1);
					}
				}
			} else {
				$scope.offer.$remove(function() {
					$location.path('offers');
				});
			}
		};

		// Update existing Offer
		$scope.update = function() {
			var offer = $scope.offer;

			offer.$update(function() {
				$location.path('offers/' + offer._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Offers
		$scope.find = function() {
			$scope.offers = Offers.query();
		};

		// Find existing Offer
		$scope.findOne = function() {
			$scope.offer = Offers.get({ 
				offerId: $stateParams.offerId
			});
		};
	}
]);