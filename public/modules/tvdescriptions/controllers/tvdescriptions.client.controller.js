'use strict';

// Tvdescriptions controller
angular.module('tvdescriptions').controller('TvdescriptionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tvdescriptions',
	function($scope, $stateParams, $location, Authentication, Tvdescriptions) {
		$scope.authentication = Authentication;

		// Create new Tvdescription
		$scope.create = function() {
			// Create new Tvdescription object
			var tvdescription = new Tvdescriptions ({
				name: this.name
			});

			// Redirect after save
			tvdescription.$save(function(response) {
				$location.path('tvdescriptions/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Tvdescription
		$scope.remove = function(tvdescription) {
			if ( tvdescription ) { 
				tvdescription.$remove();

				for (var i in $scope.tvdescriptions) {
					if ($scope.tvdescriptions [i] === tvdescription) {
						$scope.tvdescriptions.splice(i, 1);
					}
				}
			} else {
				$scope.tvdescription.$remove(function() {
					$location.path('tvdescriptions');
				});
			}
		};

		// Update existing Tvdescription
		$scope.update = function() {
			var tvdescription = $scope.tvdescription;

			tvdescription.$update(function() {
				$location.path('tvdescriptions/' + tvdescription._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Tvdescriptions
		$scope.find = function() {
			$scope.tvdescriptions = Tvdescriptions.query();
		};

		// Find existing Tvdescription
		$scope.findOne = function() {
			$scope.tvdescription = Tvdescriptions.get({ 
				tvdescriptionId: $stateParams.tvdescriptionId
			});
		};
	}
]);