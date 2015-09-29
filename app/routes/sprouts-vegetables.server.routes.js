'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var sproutsVegetables = require('../../app/controllers/sprouts-vegetables.server.controller');

	// Sprouts vegetables Routes
	app.route('/sprouts-vegetables')
		.get(sproutsVegetables.list)
		.post(users.requiresLogin, sproutsVegetables.create);

  app.route('/sprouts-vegetables/page/:page')
      .get(sproutsVegetables.listPage)

	app.route('/sprouts-vegetables/:sproutsVegetableId')
		.get(sproutsVegetables.read)
		.put(users.requiresLogin, sproutsVegetables.hasAuthorization, sproutsVegetables.update)
		.delete(users.requiresLogin, sproutsVegetables.hasAuthorization, sproutsVegetables.delete);

	// Finish by binding the Sprouts vegetable middleware
	app.param('sproutsVegetableId', sproutsVegetables.sproutsVegetableByID);
};
