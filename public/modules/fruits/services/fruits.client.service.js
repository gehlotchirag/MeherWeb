'use strict';

//Fruits service used to communicate Fruits REST endpoints
angular.module('fruits').factory('Fruits', ['$resource',
	function($resource) {
		return $resource('fruits/:fruitId', { fruitId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);