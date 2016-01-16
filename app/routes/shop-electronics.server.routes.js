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

  app.route('/shop-electronics/near/:electronicslng/:electronicslat/:electronicspage')
      .get(shopElectronics.listNear);

  app.route('/shop-electronics/mobile/:mobile/:deviceId')
      .get(shopElectronics.shopElectronicByMobile);

  app.route('/shop-electronicsdata/:listOfElectronicsPage')
      .get(shopElectronics.listOfElectronics);

  app.route('/shop-electronics/:shopElectronicId')
		.get(shopElectronics.read)
		.put(shopElectronics.update)
		.delete(users.requiresLogin, shopElectronics.hasAuthorization, shopElectronics.delete);

	// Finish by binding the Shop electronic middleware
	app.param('shopElectronicId', shopElectronics.shopElectronicByID);
  app.param('listOfElectronicsPage', shopElectronics.listOfElectronics);

  app.param('electronicslng', shopElectronics.listNear);
  app.param('electronicslat', shopElectronics.listNear);
  app.param('electronicspage', shopElectronics.listNear);
};
