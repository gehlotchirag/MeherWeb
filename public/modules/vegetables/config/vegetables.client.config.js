'use strict';

// Configuring the Articles module
angular.module('vegetables').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Vegetables', 'vegetables', 'dropdown', '/vegetables(/create)?');
		Menus.addSubMenuItem('topbar', 'vegetables', 'List Vegetables', 'vegetables');
		Menus.addSubMenuItem('topbar', 'vegetables', 'New Vegetable', 'vegetables/create');
	}
]);