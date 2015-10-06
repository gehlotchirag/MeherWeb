'use strict';

//Acs service used to communicate Acs REST endpoints
angular.module('acs').factory('Acs', ['$resource',
	function($resource) {
		return $resource('acs/:acId', { acId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);