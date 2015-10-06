'use strict';

//Tvdescriptions service used to communicate Tvdescriptions REST endpoints
angular.module('tvdescriptions').factory('Tvdescriptions', ['$resource',
	function($resource) {
		return $resource('tvdescriptions/:tvdescriptionId', { tvdescriptionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);