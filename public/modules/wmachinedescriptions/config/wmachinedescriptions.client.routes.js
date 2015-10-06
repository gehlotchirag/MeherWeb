'use strict';

//Setting up route
angular.module('wmachinedescriptions').config(['$stateProvider',
	function($stateProvider) {
		// Wmachinedescriptions state routing
		$stateProvider.
		state('listWmachinedescriptions', {
			url: '/wmachinedescriptions',
			templateUrl: 'modules/wmachinedescriptions/views/list-wmachinedescriptions.client.view.html'
		}).
		state('createWmachinedescription', {
			url: '/wmachinedescriptions/create',
			templateUrl: 'modules/wmachinedescriptions/views/create-wmachinedescription.client.view.html'
		}).
		state('viewWmachinedescription', {
			url: '/wmachinedescriptions/:wmachinedescriptionId',
			templateUrl: 'modules/wmachinedescriptions/views/view-wmachinedescription.client.view.html'
		}).
		state('editWmachinedescription', {
			url: '/wmachinedescriptions/:wmachinedescriptionId/edit',
			templateUrl: 'modules/wmachinedescriptions/views/edit-wmachinedescription.client.view.html'
		});
	}
]);