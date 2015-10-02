'use strict';

// Configuring the Articles module
angular.module('personalcares').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Personalcares', 'personalcares', 'dropdown', '/personalcares(/create)?');
		Menus.addSubMenuItem('topbar', 'personalcares', 'List Personalcares', 'personalcares');
		Menus.addSubMenuItem('topbar', 'personalcares', 'New Personalcare', 'personalcares/create');
	}
]);