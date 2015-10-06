'use strict';

//Setting up route
angular.module('refrigeratordescriptions').config(['$stateProvider',
	function($stateProvider) {
		// Refrigeratordescriptions state routing
		$stateProvider.
		state('listRefrigeratordescriptions', {
			url: '/refrigeratordescriptions',
			templateUrl: 'modules/refrigeratordescriptions/views/list-refrigeratordescriptions.client.view.html'
		}).
		state('createRefrigeratordescription', {
			url: '/refrigeratordescriptions/create',
			templateUrl: 'modules/refrigeratordescriptions/views/create-refrigeratordescription.client.view.html'
		}).
		state('viewRefrigeratordescription', {
			url: '/refrigeratordescriptions/:refrigeratordescriptionId',
			templateUrl: 'modules/refrigeratordescriptions/views/view-refrigeratordescription.client.view.html'
		}).
		state('editRefrigeratordescription', {
			url: '/refrigeratordescriptions/:refrigeratordescriptionId/edit',
			templateUrl: 'modules/refrigeratordescriptions/views/edit-refrigeratordescription.client.view.html'
		});
	}
]);