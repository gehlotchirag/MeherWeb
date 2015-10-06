'use strict';

//Setting up route
angular.module('mobiles').config(['$stateProvider',
	function($stateProvider) {
		// Mobiles state routing
		$stateProvider.
		state('listMobiles', {
			url: '/mobiles',
			templateUrl: 'modules/mobiles/views/list-mobiles.client.view.html'
		}).
		state('createMobile', {
			url: '/mobiles/create',
			templateUrl: 'modules/mobiles/views/create-mobile.client.view.html'
		}).
		state('viewMobile', {
			url: '/mobiles/:mobileId',
			templateUrl: 'modules/mobiles/views/view-mobile.client.view.html'
		}).
		state('editMobile', {
			url: '/mobiles/:mobileId/edit',
			templateUrl: 'modules/mobiles/views/edit-mobile.client.view.html'
		});
	}
]);