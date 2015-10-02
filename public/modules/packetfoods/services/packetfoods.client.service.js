'use strict';

//Packetfoods service used to communicate Packetfoods REST endpoints
angular.module('packetfoods').factory('Packetfoods', ['$resource',
	function($resource) {
		return $resource('packetfoods/:packetfoodId', { packetfoodId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);