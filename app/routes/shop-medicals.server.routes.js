'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var shopMedicals = require('../../app/controllers/shop-medicals.server.controller');

	// Shop medicals Routes
	app.route('/shop-medicals')
		.get(shopMedicals.list)
		.post(users.requiresLogin, shopMedicals.create);

  app.route('/shop-medicalsAll')
      .post(users.requiresLogin, shopMedicals.createAll);

	app.route('/shop-medicals/:shopMedicalId')
		.get(shopMedicals.read)
		.put(users.requiresLogin, shopMedicals.hasAuthorization, shopMedicals.update)
		.delete(users.requiresLogin, shopMedicals.hasAuthorization, shopMedicals.delete);

	// Finish by binding the Shop medical middleware
	app.param('shopMedicalId', shopMedicals.shopMedicalByID);
};
