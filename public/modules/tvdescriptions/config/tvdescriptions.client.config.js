'use strict';

// Configuring the Articles module
angular.module('tvdescriptions').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Tvdescriptions', 'tvdescriptions', 'dropdown', '/tvdescriptions(/create)?');
		Menus.addSubMenuItem('topbar', 'tvdescriptions', 'List Tvdescriptions', 'tvdescriptions');
		Menus.addSubMenuItem('topbar', 'tvdescriptions', 'New Tvdescription', 'tvdescriptions/create');
	}
]);