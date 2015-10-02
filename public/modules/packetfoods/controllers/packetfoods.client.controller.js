'use strict';

// Packetfoods controller
angular.module('packetfoods').controller('PacketfoodsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Packetfoods',
	function($scope, $stateParams, $location, Authentication, Packetfoods) {
		$scope.authentication = Authentication;

		// Create new Packetfood
		$scope.create = function() {
			// Create new Packetfood object
			var packetfood = new Packetfoods ({
				name: this.name
			});

			// Redirect after save
			packetfood.$save(function(response) {
				$location.path('packetfoods/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Packetfood
		$scope.remove = function(packetfood) {
			if ( packetfood ) { 
				packetfood.$remove();

				for (var i in $scope.packetfoods) {
					if ($scope.packetfoods [i] === packetfood) {
						$scope.packetfoods.splice(i, 1);
					}
				}
			} else {
				$scope.packetfood.$remove(function() {
					$location.path('packetfoods');
				});
			}
		};

		// Update existing Packetfood
		$scope.update = function() {
			var packetfood = $scope.packetfood;

			packetfood.$update(function() {
				$location.path('packetfoods/' + packetfood._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Packetfoods
		$scope.find = function() {
			$scope.packetfoods = Packetfoods.query();
		};

		// Find existing Packetfood
		$scope.findOne = function() {
			$scope.packetfood = Packetfoods.get({ 
				packetfoodId: $stateParams.packetfoodId
			});
		};
	}
]);