'use strict';

// Configuring the Articles module
angular.module('wmachinedescriptions').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Wmachinedescriptions', 'wmachinedescriptions', 'dropdown', '/wmachinedescriptions(/create)?');
		Menus.addSubMenuItem('topbar', 'wmachinedescriptions', 'List Wmachinedescriptions', 'wmachinedescriptions');
		Menus.addSubMenuItem('topbar', 'wmachinedescriptions', 'New Wmachinedescription', 'wmachinedescriptions/create');
	}
]);