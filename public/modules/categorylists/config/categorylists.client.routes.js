'use strict';

//Setting up route
angular.module('categorylists').config(['$stateProvider',
	function($stateProvider) {
		// Categorylists state routing
		$stateProvider.
		state('listCategorylists', {
			url: '/categorylists',
			templateUrl: 'modules/categorylists/views/list-categorylists.client.view.html'
		}).
		state('createCategorylist', {
			url: '/categorylists/create',
			templateUrl: 'modules/categorylists/views/create-categorylist.client.view.html'
		}).
		state('viewCategorylist', {
			url: '/categorylists/:categorylistId',
			templateUrl: 'modules/categorylists/views/view-categorylist.client.view.html'
		}).
		state('editCategorylist', {
			url: '/categorylists/:categorylistId/edit',
			templateUrl: 'modules/categorylists/views/edit-categorylist.client.view.html'
		});
	}
]);