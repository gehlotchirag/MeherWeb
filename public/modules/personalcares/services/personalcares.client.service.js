'use strict';

//Personalcares service used to communicate Personalcares REST endpoints
angular.module('personalcares').factory('Personalcares', ['$resource',
	function($resource) {
		return $resource('personalcares/:personalcareId', { personalcareId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);