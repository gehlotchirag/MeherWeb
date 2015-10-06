'use strict';

//Tvs service used to communicate Tvs REST endpoints
angular.module('tvs').factory('Tvs', ['$resource',
	function($resource) {
		return $resource('tvs/:tvId', { tvId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);