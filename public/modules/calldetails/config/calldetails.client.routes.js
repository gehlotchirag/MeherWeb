'use strict';

//Setting up route
angular.module('calldetails').config(['$stateProvider',
	function($stateProvider) {
		// Calldetails state routing
		$stateProvider.
		state('listCalldetails', {
			url: '/calldetails',
			templateUrl: 'modules/calldetails/views/list-calldetails.client.view.html'
		}).
		state('createCalldetail', {
			url: '/calldetails/create',
			templateUrl: 'modules/calldetails/views/create-calldetail.client.view.html'
		}).
		state('viewCalldetail', {
			url: '/calldetails/:calldetailId',
			templateUrl: 'modules/calldetails/views/view-calldetail.client.view.html'
		}).
		state('editCalldetail', {
			url: '/calldetails/:calldetailId/edit',
			templateUrl: 'modules/calldetails/views/edit-calldetail.client.view.html'
		});
	}
]);