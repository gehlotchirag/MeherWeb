'use strict';

// Configuring the Articles module
angular.module('mobiledescriptions').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Mobiledescriptions', 'mobiledescriptions', 'dropdown', '/mobiledescriptions(/create)?');
		Menus.addSubMenuItem('topbar', 'mobiledescriptions', 'List Mobiledescriptions', 'mobiledescriptions');
		Menus.addSubMenuItem('topbar', 'mobiledescriptions', 'New Mobiledescription', 'mobiledescriptions/create');
	}
]);