'use strict';

//Refrigerators service used to communicate Refrigerators REST endpoints
angular.module('refrigerators').factory('Refrigerators', ['$resource',
	function($resource) {
		return $resource('refrigerators/:refrigeratorId', { refrigeratorId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);