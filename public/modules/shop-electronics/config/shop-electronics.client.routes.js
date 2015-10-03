'use strict';

//Setting up route
angular.module('shop-electronics').config(['$stateProvider',
	function($stateProvider) {
		// Shop electronics state routing
		$stateProvider.
		state('listShopElectronics', {
			url: '/shop-electronics',
			templateUrl: 'modules/shop-electronics/views/list-shop-electronics.client.view.html'
		}).
		state('createShopElectronic', {
			url: '/shop-electronics/create',
			templateUrl: 'modules/shop-electronics/views/create-shop-electronic.client.view.html'
		}).
		state('viewShopElectronic', {
			url: '/shop-electronics/:shopElectronicId',
			templateUrl: 'modules/shop-electronics/views/view-shop-electronic.client.view.html'
		}).
		state('editShopElectronic', {
			url: '/shop-electronics/:shopElectronicId/edit',
			templateUrl: 'modules/shop-electronics/views/edit-shop-electronic.client.view.html'
		});
	}
]);