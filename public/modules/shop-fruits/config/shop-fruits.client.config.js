'use strict';

// Configuring the Articles module
angular.module('shop-fruits').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Shop fruits', 'shop-fruits', 'dropdown', '/shop-fruits(/create)?');
		Menus.addSubMenuItem('topbar', 'shop-fruits', 'List Shop fruits', 'shop-fruits');
		Menus.addSubMenuItem('topbar', 'shop-fruits', 'New Shop fruit', 'shop-fruits/create');
	}
]);