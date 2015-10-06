'use strict';

//Setting up route
angular.module('acs').config(['$stateProvider',
	function($stateProvider) {
		// Acs state routing
		$stateProvider.
		state('listAcs', {
			url: '/acs',
			templateUrl: 'modules/acs/views/list-acs.client.view.html'
		}).
		state('createAc', {
			url: '/acs/create',
			templateUrl: 'modules/acs/views/create-ac.client.view.html'
		}).
		state('viewAc', {
			url: '/acs/:acId',
			templateUrl: 'modules/acs/views/view-ac.client.view.html'
		}).
		state('editAc', {
			url: '/acs/:acId/edit',
			templateUrl: 'modules/acs/views/edit-ac.client.view.html'
		});
	}
]);