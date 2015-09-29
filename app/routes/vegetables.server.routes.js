'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var vegetables = require('../../app/controllers/vegetables.server.controller');

	// Vegetables Routes
	app.route('/vegetables')
		.get(vegetables.list)
		.post(users.requiresLogin, vegetables.create);

  app.route('/vegetables/page/:page')
      .get(vegetables.listPage)

  app.route('/vegetables/:vegetableId')
		.get(vegetables.read)
		.put(users.requiresLogin, vegetables.hasAuthorization, vegetables.update)
		.delete(users.requiresLogin, vegetables.hasAuthorization, vegetables.delete);

	// Finish by binding the Vegetable middleware
	app.param('vegetableId', vegetables.vegetableByID);
};
