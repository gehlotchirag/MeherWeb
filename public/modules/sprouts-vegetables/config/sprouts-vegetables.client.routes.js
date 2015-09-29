'use strict';

//Setting up route
angular.module('sprouts-vegetables').config(['$stateProvider',
	function($stateProvider) {
		// Sprouts vegetables state routing
		$stateProvider.
		state('listSproutsVegetables', {
			url: '/sprouts-vegetables',
			templateUrl: 'modules/sprouts-vegetables/views/list-sprouts-vegetables.client.view.html'
		}).
		state('createSproutsVegetable', {
			url: '/sprouts-vegetables/create',
			templateUrl: 'modules/sprouts-vegetables/views/create-sprouts-vegetable.client.view.html'
		}).
		state('viewSproutsVegetable', {
			url: '/sprouts-vegetables/:sproutsVegetableId',
			templateUrl: 'modules/sprouts-vegetables/views/view-sprouts-vegetable.client.view.html'
		}).
		state('editSproutsVegetable', {
			url: '/sprouts-vegetables/:sproutsVegetableId/edit',
			templateUrl: 'modules/sprouts-vegetables/views/edit-sprouts-vegetable.client.view.html'
		});
	}
]);