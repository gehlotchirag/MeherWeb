'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var shopGroceries = require('../../app/controllers/shop-groceries.server.controller');

	// Shop groceries Routes
	app.route('/shop-groceries')
		.get(shopGroceries.list)
		.post(users.requiresLogin, shopGroceries.create);

  app.route('/shop-groceriesAll')
      //.post( shopGroceries.createAll);
      .post(users.requiresLogin, shopGroceries.createAll);

  app.route('/shop-groceries/near/:lng/:lat/:page')
      .get(shopGroceries.listNear);

  app.route('/shop-groceries/mobile/:mobile/:deviceId')
      .get(shopGroceries.shopGroceryByMobile);

  app.route('/shop-groceriesdata/:listOfGroceriesPage')
      .get(shopGroceries.listOfGroceries);


  app.route('/shop-groceries/:shopGroceryId')
		.get(shopGroceries.read)
		//.put(users.requiresLogin, shopGroceries.hasAuthorization, shopGroceries.update)
		.put(shopGroceries.update)
		.delete(users.requiresLogin, shopGroceries.hasAuthorization, shopGroceries.delete);

  app.route('/shop-groceries-devices/')
      .get(shopGroceries.listByDevice);

  // Finish by binding the Shop grocery middleware
	app.param('shopGroceryId', shopGroceries.shopGroceryByID);
	app.param('listOfGroceriesPage', shopGroceries.listOfGroceries);
};
