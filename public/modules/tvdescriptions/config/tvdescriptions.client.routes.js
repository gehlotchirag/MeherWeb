'use strict';

//Setting up route
angular.module('tvdescriptions').config(['$stateProvider',
	function($stateProvider) {
		// Tvdescriptions state routing
		$stateProvider.
		state('listTvdescriptions', {
			url: '/tvdescriptions',
			templateUrl: 'modules/tvdescriptions/views/list-tvdescriptions.client.view.html'
		}).
		state('createTvdescription', {
			url: '/tvdescriptions/create',
			templateUrl: 'modules/tvdescriptions/views/create-tvdescription.client.view.html'
		}).
		state('viewTvdescription', {
			url: '/tvdescriptions/:tvdescriptionId',
			templateUrl: 'modules/tvdescriptions/views/view-tvdescription.client.view.html'
		}).
		state('editTvdescription', {
			url: '/tvdescriptions/:tvdescriptionId/edit',
			templateUrl: 'modules/tvdescriptions/views/edit-tvdescription.client.view.html'
		});
	}
]);