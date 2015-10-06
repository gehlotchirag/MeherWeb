'use strict';

//Wmachinedescriptions service used to communicate Wmachinedescriptions REST endpoints
angular.module('wmachinedescriptions').factory('Wmachinedescriptions', ['$resource',
	function($resource) {
		return $resource('wmachinedescriptions/:wmachinedescriptionId', { wmachinedescriptionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);