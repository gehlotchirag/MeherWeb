'use strict';

//Shop electronics service used to communicate Shop electronics REST endpoints
angular.module('shop-electronics').factory('ShopElectronics', ['$resource',
	function($resource) {
		return $resource('shop-electronics/:shopElectronicId', { shopElectronicId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);