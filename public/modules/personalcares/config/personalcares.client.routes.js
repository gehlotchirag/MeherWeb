'use strict';

//Setting up route
angular.module('personalcares').config(['$stateProvider',
	function($stateProvider) {
		// Personalcares state routing
		$stateProvider.
		state('listPersonalcares', {
			url: '/personalcares',
			templateUrl: 'modules/personalcares/views/list-personalcares.client.view.html'
		}).
		state('createPersonalcare', {
			url: '/personalcares/create',
			templateUrl: 'modules/personalcares/views/create-personalcare.client.view.html'
		}).
		state('viewPersonalcare', {
			url: '/personalcares/:personalcareId',
			templateUrl: 'modules/personalcares/views/view-personalcare.client.view.html'
		}).
		state('editPersonalcare', {
			url: '/personalcares/:personalcareId/edit',
			templateUrl: 'modules/personalcares/views/edit-personalcare.client.view.html'
		});
	}
]);