'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var shopElectronics = require('../../app/controllers/shop-electronics.server.controller');

	// Shop electronics Routes
	app.route('/shop-electronics')
		.get(shopElectronics.list)
		.post(users.requiresLogin, shopElectronics.create);

  app.route('/shop-electronicsAll')
      .post(users.requiresLogin, shopElectronics.createAll);

  app.route('/shop-electronics/near/:lng/:lat/:page')
      .get(shopElectronics.listNear)

  app.route('/shop-electronics/:shopElectronicId')
		.get(shopElectronics.read)
		.put(users.requiresLogin, shopElectronics.hasAuthorization, shopElectronics.update)
		.delete(users.requiresLogin, shopElectronics.hasAuthorization, shopElectronics.delete);

	// Finish by binding the Shop electronic middleware
	app.param('shopElectronicId', shopElectronics.shopElectronicByID);
};
