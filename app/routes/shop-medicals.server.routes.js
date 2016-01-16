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

  app.route('/shop-medicals/near/:medicalslng/:medicalslat/:medicalspage')
      .get(shopMedicals.listNear)

  app.route('/shop-medicals/mobile/:mobile/:deviceId')
      .get(shopMedicals.shopMedicalByMobile)

  app.route('/shop-medicals/:shopMedicalId')
		.get(shopMedicals.read)
		.put(shopMedicals.update)
		.delete(users.requiresLogin, shopMedicals.hasAuthorization, shopMedicals.delete);

  app.route('/shop-medicalsdata/:listOfMedicalsPage')
      .get(shopMedicals.listOfMedicals);

	// Finish by binding the Shop medical middleware
	app.param('shopMedicalId', shopMedicals.shopMedicalByID);
  app.param('listOfMedicalsPage', shopMedicals.listOfMedicals);

  app.param('medicalslng', shopMedicals.listNear);
  app.param('medicalslat', shopMedicals.listNear);
  app.param('medicalspage', shopMedicals.listNear);
};
