'use strict';

//Shop medicals service used to communicate Shop medicals REST endpoints
angular.module('shop-medicals').factory('ShopMedicals', ['$resource',
	function($resource) {
		return $resource('shop-medicals/:shopMedicalId', { shopMedicalId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);