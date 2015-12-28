'use strict';

// Consumers controller
angular.module('consumers').controller('ConsumersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Consumers',
	function($scope, $stateParams, $location, Authentication, Consumers) {
		$scope.authentication = Authentication;

		// Create new Consumer
		$scope.create = function() {
			// Create new Consumer object
			var consumer = new Consumers ({
				name: this.name
			});

			// Redirect after save
			consumer.$save(function(response) {
				$location.path('consumers/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Consumer
		$scope.remove = function(consumer) {
			if ( consumer ) { 
				consumer.$remove();

				for (var i in $scope.consumers) {
					if ($scope.consumers [i] === consumer) {
						$scope.consumers.splice(i, 1);
					}
				}
			} else {
				$scope.consumer.$remove(function() {
					$location.path('consumers');
				});
			}
		};

		// Update existing Consumer
		$scope.update = function() {
			var consumer = $scope.consumer;

			consumer.$update(function() {
				$location.path('consumers/' + consumer._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Consumers
		$scope.find = function() {
			$scope.consumers = Consumers.query();
		};

		// Find existing Consumer
		$scope.findOne = function() {
			$scope.consumer = Consumers.get({ 
				consumerId: $stateParams.consumerId
			});
		};
	}
]);