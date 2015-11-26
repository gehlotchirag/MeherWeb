'use strict';

// Configuring the Articles module
angular.module('calldetails').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Calldetails', 'calldetails', 'dropdown', '/calldetails(/create)?');
		Menus.addSubMenuItem('topbar', 'calldetails', 'List Calldetails', 'calldetails');
		Menus.addSubMenuItem('topbar', 'calldetails', 'New Calldetail', 'calldetails/create');
	}
]);