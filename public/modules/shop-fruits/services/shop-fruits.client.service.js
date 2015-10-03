'use strict';

//Shop fruits service used to communicate Shop fruits REST endpoints
angular.module('shop-fruits').factory('ShopFruits', ['$resource',
	function($resource) {
		return $resource('shop-fruits/:shopFruitId', { shopFruitId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);