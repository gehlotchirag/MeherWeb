'use strict';

//Mobiledescriptions service used to communicate Mobiledescriptions REST endpoints
angular.module('mobiledescriptions').factory('Mobiledescriptions', ['$resource',
	function($resource) {
		return $resource('mobiledescriptions/:mobiledescriptionId', { mobiledescriptionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);