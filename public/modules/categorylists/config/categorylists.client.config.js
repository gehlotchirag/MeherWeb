'use strict';

// Configuring the Articles module
angular.module('categorylists').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Categorylists', 'categorylists', 'dropdown', '/categorylists(/create)?');
		Menus.addSubMenuItem('topbar', 'categorylists', 'List Categorylists', 'categorylists');
		Menus.addSubMenuItem('topbar', 'categorylists', 'New Categorylist', 'categorylists/create');
	}
]);