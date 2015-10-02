'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var categorylists = require('../../app/controllers/categorylists.server.controller');

	// Categorylists Routes
	app.route('/categorylists')
		.get(categorylists.list)
		.post(users.requiresLogin, categorylists.create);

	app.route('/categorylists/:categorylistId')
		.get(categorylists.read)
		.put(users.requiresLogin, categorylists.hasAuthorization, categorylists.update)
		.delete(users.requiresLogin, categorylists.hasAuthorization, categorylists.delete);

	// Finish by binding the Categorylist middleware
	app.param('categorylistId', categorylists.categorylistByID);
};
