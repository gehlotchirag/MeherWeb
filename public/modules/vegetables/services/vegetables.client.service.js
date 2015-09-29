'use strict';

//Vegetables service used to communicate Vegetables REST endpoints
angular.module('vegetables').factory('Vegetables', ['$resource',
	function($resource) {
		return $resource('vegetables/:vegetableId', { vegetableId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);