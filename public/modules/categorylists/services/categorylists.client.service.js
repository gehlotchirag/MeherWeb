'use strict';

//Categorylists service used to communicate Categorylists REST endpoints
angular.module('categorylists').factory('Categorylists', ['$resource',
	function($resource) {
		return $resource('categorylists/:categorylistId', { categorylistId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);