'use strict';

// Configuring the Articles module
angular.module('wmachines').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Wmachines', 'wmachines', 'dropdown', '/wmachines(/create)?');
		Menus.addSubMenuItem('topbar', 'wmachines', 'List Wmachines', 'wmachines');
		Menus.addSubMenuItem('topbar', 'wmachines', 'New Wmachine', 'wmachines/create');
	}
]);