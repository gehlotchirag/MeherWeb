'use strict';

// Categorylists controller
angular.module('categorylists').controller('CategorylistsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Categorylists',
	function($scope, $stateParams, $location, Authentication, Categorylists) {
		$scope.authentication = Authentication;

		// Create new Categorylist
		$scope.create = function() {
			// Create new Categorylist object
			var categorylist = new Categorylists ({
				name: this.name
			});

			// Redirect after save
			categorylist.$save(function(response) {
				$location.path('categorylists/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Categorylist
		$scope.remove = function(categorylist) {
			if ( categorylist ) { 
				categorylist.$remove();

				for (var i in $scope.categorylists) {
					if ($scope.categorylists [i] === categorylist) {
						$scope.categorylists.splice(i, 1);
					}
				}
			} else {
				$scope.categorylist.$remove(function() {
					$location.path('categorylists');
				});
			}
		};

		// Update existing Categorylist
		$scope.update = function() {
			var categorylist = $scope.categorylist;

			categorylist.$update(function() {
				$location.path('categorylists/' + categorylist._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Categorylists
		$scope.find = function() {
			$scope.categorylists = Categorylists.query();
		};

		// Find existing Categorylist
		$scope.findOne = function() {
			$scope.categorylist = Categorylists.get({ 
				categorylistId: $stateParams.categorylistId
			});
		};
	}
]);