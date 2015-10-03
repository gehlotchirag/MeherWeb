'use strict';

//Setting up route
angular.module('shop-medicals').config(['$stateProvider',
	function($stateProvider) {
		// Shop medicals state routing
		$stateProvider.
		state('listShopMedicals', {
			url: '/shop-medicals',
			templateUrl: 'modules/shop-medicals/views/list-shop-medicals.client.view.html'
		}).
		state('createShopMedical', {
			url: '/shop-medicals/create',
			templateUrl: 'modules/shop-medicals/views/create-shop-medical.client.view.html'
		}).
		state('viewShopMedical', {
			url: '/shop-medicals/:shopMedicalId',
			templateUrl: 'modules/shop-medicals/views/view-shop-medical.client.view.html'
		}).
		state('editShopMedical', {
			url: '/shop-medicals/:shopMedicalId/edit',
			templateUrl: 'modules/shop-medicals/views/edit-shop-medical.client.view.html'
		});
	}
]);