'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var shopFruits = require('../../app/controllers/shop-fruits.server.controller');

	// Shop fruits Routes
	app.route('/shop-fruits')
		.get(shopFruits.list)
		.post(users.requiresLogin, shopFruits.create);

  app.route('/shop-fruitsAll')
      .post(users.requiresLogin, shopFruits.createAll);

  app.route('/shop-fruits/near/:lng/:lat/:page')
      .get(shopFruits.listNear);

  app.route('/shop-fruits/mobile/:mobile/:deviceId')
      .get(shopFruits.shopFruitByMobile);

  app.route('/shop-fruits/devices')
      .get(shopFruits.listByDevice);

  app.route('/shop-fruits/:shopFruitId')
		.get(shopFruits.read)
		.put(shopFruits.update)
		.delete(users.requiresLogin, shopFruits.hasAuthorization, shopFruits.delete);

	// Finish by binding the Shop fruit middleware
	app.param('shopFruitId', shopFruits.shopFruitByID);
};
