'use strict';

//Sprouts vegetables service used to communicate Sprouts vegetables REST endpoints
angular.module('sprouts-vegetables').factory('SproutsVegetables', ['$resource',
	function($resource) {
		return $resource('sprouts-vegetables/:sproutsVegetableId', { sproutsVegetableId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);