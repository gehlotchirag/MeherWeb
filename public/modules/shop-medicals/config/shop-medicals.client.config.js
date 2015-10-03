'use strict';

// Configuring the Articles module
angular.module('shop-medicals').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Shop medicals', 'shop-medicals', 'dropdown', '/shop-medicals(/create)?');
		Menus.addSubMenuItem('topbar', 'shop-medicals', 'List Shop medicals', 'shop-medicals');
		Menus.addSubMenuItem('topbar', 'shop-medicals', 'New Shop medical', 'shop-medicals/create');
	}
]);