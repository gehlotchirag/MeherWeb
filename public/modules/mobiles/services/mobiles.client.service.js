'use strict';

//Mobiles service used to communicate Mobiles REST endpoints
angular.module('mobiles').factory('Mobiles', ['$resource',
	function($resource) {
		return $resource('mobiles/:mobileId', { mobileId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);