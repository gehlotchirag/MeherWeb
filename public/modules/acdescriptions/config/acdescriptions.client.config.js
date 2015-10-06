'use strict';

// Configuring the Articles module
angular.module('acdescriptions').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Acdescriptions', 'acdescriptions', 'dropdown', '/acdescriptions(/create)?');
		Menus.addSubMenuItem('topbar', 'acdescriptions', 'List Acdescriptions', 'acdescriptions');
		Menus.addSubMenuItem('topbar', 'acdescriptions', 'New Acdescription', 'acdescriptions/create');
	}
]);