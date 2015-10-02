'use strict';

// Configuring the Articles module
angular.module('packetfoods').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Packetfoods', 'packetfoods', 'dropdown', '/packetfoods(/create)?');
		Menus.addSubMenuItem('topbar', 'packetfoods', 'List Packetfoods', 'packetfoods');
		Menus.addSubMenuItem('topbar', 'packetfoods', 'New Packetfood', 'packetfoods/create');
	}
]);