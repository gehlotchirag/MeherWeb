'use strict';

// Configuring the Articles module
angular.module('acs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Acs', 'acs', 'dropdown', '/acs(/create)?');
		Menus.addSubMenuItem('topbar', 'acs', 'List Acs', 'acs');
		Menus.addSubMenuItem('topbar', 'acs', 'New Ac', 'acs/create');
	}
]);