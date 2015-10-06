'use strict';

//Wmachines service used to communicate Wmachines REST endpoints
angular.module('wmachines').factory('Wmachines', ['$resource',
	function($resource) {
		return $resource('wmachines/:wmachineId', { wmachineId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);