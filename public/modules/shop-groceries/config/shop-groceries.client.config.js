'use strict';

// Configuring the Articles module
angular.module('shop-groceries').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Shop groceries', 'shop-groceries', 'dropdown', '/shop-groceries(/create)?');
		Menus.addSubMenuItem('topbar', 'shop-groceries', 'List Shop groceries', 'shop-groceries');
		Menus.addSubMenuItem('topbar', 'shop-groceries', 'New Shop grocery', 'shop-groceries/create');
	}
]);