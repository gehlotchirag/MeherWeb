'use strict';

// Configuring the Articles module
angular.module('groceries').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Groceries', 'groceries', 'dropdown', '/groceries(/create)?');
		Menus.addSubMenuItem('topbar', 'groceries', 'List Groceries', 'groceries');
		Menus.addSubMenuItem('topbar', 'groceries', 'New Grocery', 'groceries/create');
	}
]);