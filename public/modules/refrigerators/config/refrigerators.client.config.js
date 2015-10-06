'use strict';

// Configuring the Articles module
angular.module('refrigerators').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Refrigerators', 'refrigerators', 'dropdown', '/refrigerators(/create)?');
		Menus.addSubMenuItem('topbar', 'refrigerators', 'List Refrigerators', 'refrigerators');
		Menus.addSubMenuItem('topbar', 'refrigerators', 'New Refrigerator', 'refrigerators/create');
	}
]);