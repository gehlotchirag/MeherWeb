'use strict';

// Refrigeratordescriptions controller
angular.module('refrigeratordescriptions').controller('RefrigeratordescriptionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Refrigeratordescriptions',
	function($scope, $stateParams, $location, Authentication, Refrigeratordescriptions) {
		$scope.authentication = Authentication;

		// Create new Refrigeratordescription
		$scope.create = function() {
			// Create new Refrigeratordescription object
			var refrigeratordescription = new Refrigeratordescriptions ({
				name: this.name
			});

			// Redirect after save
			refrigeratordescription.$save(function(response) {
				$location.path('refrigeratordescriptions/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Refrigeratordescription
		$scope.remove = function(refrigeratordescription) {
			if ( refrigeratordescription ) { 
				refrigeratordescription.$remove();

				for (var i in $scope.refrigeratordescriptions) {
					if ($scope.refrigeratordescriptions [i] === refrigeratordescription) {
						$scope.refrigeratordescriptions.splice(i, 1);
					}
				}
			} else {
				$scope.refrigeratordescription.$remove(function() {
					$location.path('refrigeratordescriptions');
				});
			}
		};

		// Update existing Refrigeratordescription
		$scope.update = function() {
			var refrigeratordescription = $scope.refrigeratordescription;

			refrigeratordescription.$update(function() {
				$location.path('refrigeratordescriptions/' + refrigeratordescription._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Refrigeratordescriptions
		$scope.find = function() {
			$scope.refrigeratordescriptions = Refrigeratordescriptions.query();
		};

		// Find existing Refrigeratordescription
		$scope.findOne = function() {
			$scope.refrigeratordescription = Refrigeratordescriptions.get({ 
				refrigeratordescriptionId: $stateParams.refrigeratordescriptionId
			});
		};
	}
]);