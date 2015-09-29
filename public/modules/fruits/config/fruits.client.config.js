'use strict';

// Configuring the Articles module
angular.module('fruits').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Fruits', 'fruits', 'dropdown', '/fruits(/create)?');
		Menus.addSubMenuItem('topbar', 'fruits', 'List Fruits', 'fruits');
		Menus.addSubMenuItem('topbar', 'fruits', 'New Fruit', 'fruits/create');
	}
]);