'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var leafyVegetables = require('../../app/controllers/leafy-vegetables.server.controller');

	// Leafy vegetables Routes
	app.route('/leafy-vegetables')
		.get(leafyVegetables.list)
		.post(users.requiresLogin, leafyVegetables.create);

  app.route('/leafy-vegetables/page/:page')
      .get(leafyVegetables.listPage)

	app.route('/leafy-vegetables/:leafyVegetableId')
		.get(leafyVegetables.read)
		.put(users.requiresLogin, leafyVegetables.hasAuthorization, leafyVegetables.update)
		.delete(users.requiresLogin, leafyVegetables.hasAuthorization, leafyVegetables.delete);

	// Finish by binding the Leafy vegetable middleware
	app.param('leafyVegetableId', leafyVegetables.leafyVegetableByID);
};
