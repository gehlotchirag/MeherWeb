'use strict';

//Setting up route
angular.module('tvs').config(['$stateProvider',
	function($stateProvider) {
		// Tvs state routing
		$stateProvider.
		state('listTvs', {
			url: '/tvs',
			templateUrl: 'modules/tvs/views/list-tvs.client.view.html'
		}).
		state('createTv', {
			url: '/tvs/create',
			templateUrl: 'modules/tvs/views/create-tv.client.view.html'
		}).
		state('viewTv', {
			url: '/tvs/:tvId',
			templateUrl: 'modules/tvs/views/view-tv.client.view.html'
		}).
		state('editTv', {
			url: '/tvs/:tvId/edit',
			templateUrl: 'modules/tvs/views/edit-tv.client.view.html'
		});
	}
]);