'use strict';

//Setting up route
angular.module('mobiledescriptions').config(['$stateProvider',
	function($stateProvider) {
		// Mobiledescriptions state routing
		$stateProvider.
		state('listMobiledescriptions', {
			url: '/mobiledescriptions',
			templateUrl: 'modules/mobiledescriptions/views/list-mobiledescriptions.client.view.html'
		}).
		state('createMobiledescription', {
			url: '/mobiledescriptions/create',
			templateUrl: 'modules/mobiledescriptions/views/create-mobiledescription.client.view.html'
		}).
		state('viewMobiledescription', {
			url: '/mobiledescriptions/:mobiledescriptionId',
			templateUrl: 'modules/mobiledescriptions/views/view-mobiledescription.client.view.html'
		}).
		state('editMobiledescription', {
			url: '/mobiledescriptions/:mobiledescriptionId/edit',
			templateUrl: 'modules/mobiledescriptions/views/edit-mobiledescription.client.view.html'
		});
	}
]);