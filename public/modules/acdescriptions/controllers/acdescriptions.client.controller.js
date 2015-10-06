'use strict';

// Acdescriptions controller
angular.module('acdescriptions').controller('AcdescriptionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Acdescriptions',
	function($scope, $stateParams, $location, Authentication, Acdescriptions) {
		$scope.authentication = Authentication;

		// Create new Acdescription
		$scope.create = function() {
			// Create new Acdescription object
			var acdescription = new Acdescriptions ({
				name: this.name
			});

			// Redirect after save
			acdescription.$save(function(response) {
				$location.path('acdescriptions/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Acdescription
		$scope.remove = function(acdescription) {
			if ( acdescription ) { 
				acdescription.$remove();

				for (var i in $scope.acdescriptions) {
					if ($scope.acdescriptions [i] === acdescription) {
						$scope.acdescriptions.splice(i, 1);
					}
				}
			} else {
				$scope.acdescription.$remove(function() {
					$location.path('acdescriptions');
				});
			}
		};

		// Update existing Acdescription
		$scope.update = function() {
			var acdescription = $scope.acdescription;

			acdescription.$update(function() {
				$location.path('acdescriptions/' + acdescription._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Acdescriptions
		$scope.find = function() {
			$scope.acdescriptions = Acdescriptions.query();
		};

		// Find existing Acdescription
		$scope.findOne = function() {
			$scope.acdescription = Acdescriptions.get({ 
				acdescriptionId: $stateParams.acdescriptionId
			});
		};
	}
]);