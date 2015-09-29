'use strict';

//Setting up route
angular.module('fruits').config(['$stateProvider',
	function($stateProvider) {
		// Fruits state routing
		$stateProvider.
		state('listFruits', {
			url: '/fruits',
			templateUrl: 'modules/fruits/views/list-fruits.client.view.html'
		}).
		state('createFruit', {
			url: '/fruits/create',
			templateUrl: 'modules/fruits/views/create-fruit.client.view.html'
		}).
		state('viewFruit', {
			url: '/fruits/:fruitId',
			templateUrl: 'modules/fruits/views/view-fruit.client.view.html'
		}).
		state('editFruit', {
			url: '/fruits/:fruitId/edit',
			templateUrl: 'modules/fruits/views/edit-fruit.client.view.html'
		});
	}
]);