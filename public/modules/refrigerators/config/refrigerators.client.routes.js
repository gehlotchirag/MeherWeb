'use strict';

//Setting up route
angular.module('refrigerators').config(['$stateProvider',
	function($stateProvider) {
		// Refrigerators state routing
		$stateProvider.
		state('listRefrigerators', {
			url: '/refrigerators',
			templateUrl: 'modules/refrigerators/views/list-refrigerators.client.view.html'
		}).
		state('createRefrigerator', {
			url: '/refrigerators/create',
			templateUrl: 'modules/refrigerators/views/create-refrigerator.client.view.html'
		}).
		state('viewRefrigerator', {
			url: '/refrigerators/:refrigeratorId',
			templateUrl: 'modules/refrigerators/views/view-refrigerator.client.view.html'
		}).
		state('editRefrigerator', {
			url: '/refrigerators/:refrigeratorId/edit',
			templateUrl: 'modules/refrigerators/views/edit-refrigerator.client.view.html'
		});
	}
]);