'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var groceries = require('../../app/controllers/groceries.server.controller');

	// Groceries Routes
	app.route('/groceries')
		.get(groceries.list)
		.post(users.requiresLogin, groceries.create);

  app.route('/groceries/:category/:page')
      .get(groceries.listPage);

  app.route('/groceriesAll')
      .post(users.requiresLogin, groceries.createAll);

  app.route('/groceries-search/:searchText')
      .get(groceries.Search);


  app.route('/groceries/:groceryId')
		.get(groceries.read)
		.put(users.requiresLogin, groceries.hasAuthorization, groceries.update)
		.delete(users.requiresLogin, groceries.delete);

	// Finish by binding the Grocery middleware
	app.param('groceryId', groceries.groceryByID);


};
