'use strict';

//Setting up route
angular.module('wmachines').config(['$stateProvider',
	function($stateProvider) {
		// Wmachines state routing
		$stateProvider.
		state('listWmachines', {
			url: '/wmachines',
			templateUrl: 'modules/wmachines/views/list-wmachines.client.view.html'
		}).
		state('createWmachine', {
			url: '/wmachines/create',
			templateUrl: 'modules/wmachines/views/create-wmachine.client.view.html'
		}).
		state('viewWmachine', {
			url: '/wmachines/:wmachineId',
			templateUrl: 'modules/wmachines/views/view-wmachine.client.view.html'
		}).
		state('editWmachine', {
			url: '/wmachines/:wmachineId/edit',
			templateUrl: 'modules/wmachines/views/edit-wmachine.client.view.html'
		});
	}
]);