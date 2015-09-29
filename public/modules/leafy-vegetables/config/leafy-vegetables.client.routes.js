'use strict';

//Setting up route
angular.module('leafy-vegetables').config(['$stateProvider',
	function($stateProvider) {
		// Leafy vegetables state routing
		$stateProvider.
		state('listLeafyVegetables', {
			url: '/leafy-vegetables',
			templateUrl: 'modules/leafy-vegetables/views/list-leafy-vegetables.client.view.html'
		}).
		state('createLeafyVegetable', {
			url: '/leafy-vegetables/create',
			templateUrl: 'modules/leafy-vegetables/views/create-leafy-vegetable.client.view.html'
		}).
		state('viewLeafyVegetable', {
			url: '/leafy-vegetables/:leafyVegetableId',
			templateUrl: 'modules/leafy-vegetables/views/view-leafy-vegetable.client.view.html'
		}).
		state('editLeafyVegetable', {
			url: '/leafy-vegetables/:leafyVegetableId/edit',
			templateUrl: 'modules/leafy-vegetables/views/edit-leafy-vegetable.client.view.html'
		});
	}
]);