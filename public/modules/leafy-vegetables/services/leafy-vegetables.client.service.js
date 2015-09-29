'use strict';

//Leafy vegetables service used to communicate Leafy vegetables REST endpoints
angular.module('leafy-vegetables').factory('LeafyVegetables', ['$resource',
	function($resource) {
		return $resource('leafy-vegetables/:leafyVegetableId', { leafyVegetableId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);