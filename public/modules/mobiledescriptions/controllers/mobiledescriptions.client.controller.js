'use strict';

// Mobiledescriptions controller
angular.module('mobiledescriptions').controller('MobiledescriptionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Mobiledescriptions',
	function($scope, $stateParams, $location, Authentication, Mobiledescriptions) {
		$scope.authentication = Authentication;

		// Create new Mobiledescription
		$scope.create = function() {
			// Create new Mobiledescription object
			var mobiledescription = new Mobiledescriptions ({
				name: this.name
			});

			// Redirect after save
			mobiledescription.$save(function(response) {
				$location.path('mobiledescriptions/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Mobiledescription
		$scope.remove = function(mobiledescription) {
			if ( mobiledescription ) { 
				mobiledescription.$remove();

				for (var i in $scope.mobiledescriptions) {
					if ($scope.mobiledescriptions [i] === mobiledescription) {
						$scope.mobiledescriptions.splice(i, 1);
					}
				}
			} else {
				$scope.mobiledescription.$remove(function() {
					$location.path('mobiledescriptions');
				});
			}
		};

		// Update existing Mobiledescription
		$scope.update = function() {
			var mobiledescription = $scope.mobiledescription;

			mobiledescription.$update(function() {
				$location.path('mobiledescriptions/' + mobiledescription._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Mobiledescriptions
		$scope.find = function() {
			$scope.mobiledescriptions = Mobiledescriptions.query();
		};

		// Find existing Mobiledescription
		$scope.findOne = function() {
			$scope.mobiledescription = Mobiledescriptions.get({ 
				mobiledescriptionId: $stateParams.mobiledescriptionId
			});
		};
	}
]);