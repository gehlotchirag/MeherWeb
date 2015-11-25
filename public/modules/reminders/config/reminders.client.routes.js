'use strict';

//Setting up route
angular.module('reminders').config(['$stateProvider',
	function($stateProvider) {
		// Reminders state routing
		$stateProvider.
		state('listReminders', {
			url: '/reminders',
			templateUrl: 'modules/reminders/views/list-reminders.client.view.html'
		}).
		state('createReminder', {
			url: '/reminders/create',
			templateUrl: 'modules/reminders/views/create-reminder.client.view.html'
		}).
		state('viewReminder', {
			url: '/reminders/:reminderId',
			templateUrl: 'modules/reminders/views/view-reminder.client.view.html'
		}).
		state('editReminder', {
			url: '/reminders/:reminderId/edit',
			templateUrl: 'modules/reminders/views/edit-reminder.client.view.html'
		});
	}
]);