'use strict';

// Configuring the Articles module
angular.module('tvs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Tvs', 'tvs', 'dropdown', '/tvs(/create)?');
		Menus.addSubMenuItem('topbar', 'tvs', 'List Tvs', 'tvs');
		Menus.addSubMenuItem('topbar', 'tvs', 'New Tv', 'tvs/create');
	}
]);