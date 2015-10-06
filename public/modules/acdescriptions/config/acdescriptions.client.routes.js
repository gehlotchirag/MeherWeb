'use strict';

//Setting up route
angular.module('acdescriptions').config(['$stateProvider',
	function($stateProvider) {
		// Acdescriptions state routing
		$stateProvider.
		state('listAcdescriptions', {
			url: '/acdescriptions',
			templateUrl: 'modules/acdescriptions/views/list-acdescriptions.client.view.html'
		}).
		state('createAcdescription', {
			url: '/acdescriptions/create',
			templateUrl: 'modules/acdescriptions/views/create-acdescription.client.view.html'
		}).
		state('viewAcdescription', {
			url: '/acdescriptions/:acdescriptionId',
			templateUrl: 'modules/acdescriptions/views/view-acdescription.client.view.html'
		}).
		state('editAcdescription', {
			url: '/acdescriptions/:acdescriptionId/edit',
			templateUrl: 'modules/acdescriptions/views/edit-acdescription.client.view.html'
		});
	}
]);