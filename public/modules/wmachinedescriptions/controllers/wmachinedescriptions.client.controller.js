'use strict';

// Wmachinedescriptions controller
angular.module('wmachinedescriptions').controller('WmachinedescriptionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Wmachinedescriptions',
	function($scope, $stateParams, $location, Authentication, Wmachinedescriptions) {
		$scope.authentication = Authentication;

		// Create new Wmachinedescription
		$scope.create = function() {
			// Create new Wmachinedescription object
			var wmachinedescription = new Wmachinedescriptions ({
				name: this.name
			});

			// Redirect after save
			wmachinedescription.$save(function(response) {
				$location.path('wmachinedescriptions/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Wmachinedescription
		$scope.remove = function(wmachinedescription) {
			if ( wmachinedescription ) { 
				wmachinedescription.$remove();

				for (var i in $scope.wmachinedescriptions) {
					if ($scope.wmachinedescriptions [i] === wmachinedescription) {
						$scope.wmachinedescriptions.splice(i, 1);
					}
				}
			} else {
				$scope.wmachinedescription.$remove(function() {
					$location.path('wmachinedescriptions');
				});
			}
		};

		// Update existing Wmachinedescription
		$scope.update = function() {
			var wmachinedescription = $scope.wmachinedescription;

			wmachinedescription.$update(function() {
				$location.path('wmachinedescriptions/' + wmachinedescription._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Wmachinedescriptions
		$scope.find = function() {
			$scope.wmachinedescriptions = Wmachinedescriptions.query();
		};

		// Find existing Wmachinedescription
		$scope.findOne = function() {
			$scope.wmachinedescription = Wmachinedescriptions.get({ 
				wmachinedescriptionId: $stateParams.wmachinedescriptionId
			});
		};
	}
]);