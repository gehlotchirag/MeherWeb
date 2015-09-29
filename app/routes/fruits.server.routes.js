'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var fruits = require('../../app/controllers/fruits.server.controller');

	// Fruits Routes
	app.route('/fruits')
		.get(fruits.list)
		.post(users.requiresLogin, fruits.create);

  app.route('/fruits/page/:page')
      .get(fruits.listPage)

	app.route('/fruits/:fruitId')
		.get(fruits.read)
		.put(users.requiresLogin, fruits.hasAuthorization, fruits.update)
		.delete(users.requiresLogin, fruits.hasAuthorization, fruits.delete);

	// Finish by binding the Fruit middleware
	app.param('fruitId', fruits.fruitByID);
};
