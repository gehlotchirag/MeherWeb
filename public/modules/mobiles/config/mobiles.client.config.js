'use strict';

// Configuring the Articles module
angular.module('mobiles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Mobiles', 'mobiles', 'dropdown', '/mobiles(/create)?');
		Menus.addSubMenuItem('topbar', 'mobiles', 'List Mobiles', 'mobiles');
		Menus.addSubMenuItem('topbar', 'mobiles', 'New Mobile', 'mobiles/create');
	}
]);