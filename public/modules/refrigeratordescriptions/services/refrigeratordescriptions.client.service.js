'use strict';

//Refrigeratordescriptions service used to communicate Refrigeratordescriptions REST endpoints
angular.module('refrigeratordescriptions').factory('Refrigeratordescriptions', ['$resource',
	function($resource) {
		return $resource('refrigeratordescriptions/:refrigeratordescriptionId', { refrigeratordescriptionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);