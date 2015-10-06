'use strict';

// Configuring the Articles module
angular.module('refrigeratordescriptions').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Refrigeratordescriptions', 'refrigeratordescriptions', 'dropdown', '/refrigeratordescriptions(/create)?');
		Menus.addSubMenuItem('topbar', 'refrigeratordescriptions', 'List Refrigeratordescriptions', 'refrigeratordescriptions');
		Menus.addSubMenuItem('topbar', 'refrigeratordescriptions', 'New Refrigeratordescription', 'refrigeratordescriptions/create');
	}
]);