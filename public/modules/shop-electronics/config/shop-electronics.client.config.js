'use strict';

// Configuring the Articles module
angular.module('shop-electronics').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Shop electronics', 'shop-electronics', 'dropdown', '/shop-electronics(/create)?');
		Menus.addSubMenuItem('topbar', 'shop-electronics', 'List Shop electronics', 'shop-electronics');
		Menus.addSubMenuItem('topbar', 'shop-electronics', 'New Shop electronic', 'shop-electronics/create');
	}
]);