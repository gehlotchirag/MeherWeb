'use strict';

//Calldetails service used to communicate Calldetails REST endpoints
angular.module('calldetails').factory('Calldetails', ['$resource',
	function($resource) {
		return $resource('calldetails/:calldetailId', { calldetailId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);