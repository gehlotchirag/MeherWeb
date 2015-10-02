'use strict';

// Configuring the Articles module
angular.module('households').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Households', 'households', 'dropdown', '/households(/create)?');
		Menus.addSubMenuItem('topbar', 'households', 'List Households', 'households');
		Menus.addSubMenuItem('topbar', 'households', 'New Household', 'households/create');
	}
]);