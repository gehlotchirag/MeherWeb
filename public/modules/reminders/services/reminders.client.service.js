'use strict';

//Reminders service used to communicate Reminders REST endpoints
angular.module('reminders').factory('Reminders', ['$resource',
	function($resource) {
		return $resource('reminders/:reminderId', { reminderId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);