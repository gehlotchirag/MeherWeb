'use strict';

//Shop groceries service used to communicate Shop groceries REST endpoints
angular.module('shop-groceries').factory('ShopGroceries', ['$resource',
	function($resource) {
		return $resource('shop-groceries/:shopGroceryId', { shopGroceryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);