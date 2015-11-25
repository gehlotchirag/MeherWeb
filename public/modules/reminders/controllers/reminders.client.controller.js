'use strict';

// Reminders controller
angular.module('reminders').controller('RemindersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Reminders',
	function($scope, $stateParams, $location, Authentication, Reminders) {
		$scope.authentication = Authentication;

		// Create new Reminder
		$scope.create = function() {
			// Create new Reminder object
			var reminder = new Reminders ({
				name: this.name
			});

			// Redirect after save
			reminder.$save(function(response) {
				$location.path('reminders/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Reminder
		$scope.remove = function(reminder) {
			if ( reminder ) { 
				reminder.$remove();

				for (var i in $scope.reminders) {
					if ($scope.reminders [i] === reminder) {
						$scope.reminders.splice(i, 1);
					}
				}
			} else {
				$scope.reminder.$remove(function() {
					$location.path('reminders');
				});
			}
		};

		// Update existing Reminder
		$scope.update = function() {
			var reminder = $scope.reminder;

			reminder.$update(function() {
				$location.path('reminders/' + reminder._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Reminders
		$scope.find = function() {
			$scope.reminders = Reminders.query();
		};

		// Find existing Reminder
		$scope.findOne = function() {
			$scope.reminder = Reminders.get({ 
				reminderId: $stateParams.reminderId
			});
		};
	}
]);