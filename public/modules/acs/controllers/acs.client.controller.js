'use strict';

// Acs controller
angular.module('acs').controller('AcsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Acs',
	function($scope, $stateParams, $location, Authentication, Acs) {
		$scope.authentication = Authentication;

		// Create new Ac
		$scope.create = function() {
			// Create new Ac object
			var ac = new Acs ({
				name: this.name
			});

			// Redirect after save
			ac.$save(function(response) {
				$location.path('acs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Ac
		$scope.remove = function(ac) {
			if ( ac ) { 
				ac.$remove();

				for (var i in $scope.acs) {
					if ($scope.acs [i] === ac) {
						$scope.acs.splice(i, 1);
					}
				}
			} else {
				$scope.ac.$remove(function() {
					$location.path('acs');
				});
			}
		};

		// Update existing Ac
		$scope.update = function() {
			var ac = $scope.ac;

			ac.$update(function() {
				$location.path('acs/' + ac._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Acs
		$scope.find = function() {
			$scope.acs = Acs.query();
		};

		// Find existing Ac
		$scope.findOne = function() {
			$scope.ac = Acs.get({ 
				acId: $stateParams.acId
			});
		};
	}
]);