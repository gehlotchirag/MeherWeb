'use strict';

//Acdescriptions service used to communicate Acdescriptions REST endpoints
angular.module('acdescriptions').factory('Acdescriptions', ['$resource',
	function($resource) {
		return $resource('acdescriptions/:acdescriptionId', { acdescriptionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);