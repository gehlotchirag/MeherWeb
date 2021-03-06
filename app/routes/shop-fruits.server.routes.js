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

  app.route('/shop-fruits/near/:fruitslng/:fruitslat/:fruitspage')
      .get(shopFruits.listNear);

  app.route('/shop-fruits/mobile/:number/:deviceId')
      .get(shopFruits.shopFruitByMobile);

  app.route('/shop-fruits-devices')
      .get(shopFruits.listByDevice);

  app.route('/shop-fruitsdata/:listOfShopPage')
      .get(shopFruits.listOfShop);

  app.route('/shop-fruits/:shopFruitId')
		.get(shopFruits.read)
		.put(shopFruits.update)
		.delete(users.requiresLogin, shopFruits.hasAuthorization, shopFruits.delete);

	// Finish by binding the Shop fruit middleware
  app.param('mobile', shopFruits.shopFruitByMobile);

  app.param('shopFruitId', shopFruits.shopFruitByID);
	//app.param('deviceId', shopFruits.shopFruitByMobile);
  app.param('fruitslng', shopFruits.listNear);
  app.param('fruitslat', shopFruits.listNear);
  app.param('fruitspage', shopFruits.listNear);

};
