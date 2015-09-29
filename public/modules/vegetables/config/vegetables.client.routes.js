'use strict';

//Setting up route
angular.module('vegetables').config(['$stateProvider',
	function($stateProvider) {
		// Vegetables state routing
		$stateProvider.
		state('listVegetables', {
			url: '/vegetables',
			templateUrl: 'modules/vegetables/views/list-vegetables.client.view.html'
		}).
		state('createVegetable', {
			url: '/vegetables/create',
			templateUrl: 'modules/vegetables/views/create-vegetable.client.view.html'
		}).
		state('viewVegetable', {
			url: '/vegetables/:vegetableId',
			templateUrl: 'modules/vegetables/views/view-vegetable.client.view.html'
		}).
		state('editVegetable', {
			url: '/vegetables/:vegetableId/edit',
			templateUrl: 'modules/vegetables/views/edit-vegetable.client.view.html'
		});
	}
]);