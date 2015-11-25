'use strict';

// Configuring the Articles module
angular.module('reminders').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Reminders', 'reminders', 'dropdown', '/reminders(/create)?');
		Menus.addSubMenuItem('topbar', 'reminders', 'List Reminders', 'reminders');
		Menus.addSubMenuItem('topbar', 'reminders', 'New Reminder', 'reminders/create');
	}
]);