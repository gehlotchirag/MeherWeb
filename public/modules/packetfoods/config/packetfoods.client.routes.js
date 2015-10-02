'use strict';

//Setting up route
angular.module('packetfoods').config(['$stateProvider',
	function($stateProvider) {
		// Packetfoods state routing
		$stateProvider.
		state('listPacketfoods', {
			url: '/packetfoods',
			templateUrl: 'modules/packetfoods/views/list-packetfoods.client.view.html'
		}).
		state('createPacketfood', {
			url: '/packetfoods/create',
			templateUrl: 'modules/packetfoods/views/create-packetfood.client.view.html'
		}).
		state('viewPacketfood', {
			url: '/packetfoods/:packetfoodId',
			templateUrl: 'modules/packetfoods/views/view-packetfood.client.view.html'
		}).
		state('editPacketfood', {
			url: '/packetfoods/:packetfoodId/edit',
			templateUrl: 'modules/packetfoods/views/edit-packetfood.client.view.html'
		});
	}
]);