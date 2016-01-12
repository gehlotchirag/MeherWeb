'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var refrigerators = require('../../app/controllers/refrigerators.server.controller');

	// Refrigerators Routes
	app.route('/refrigerators')
		.get(refrigerators.list)
		.post(users.requiresLogin, refrigerators.create);

  app.route('/mobiles/refrigerators/:page')
      .get(refrigerators.listPage)

  app.route('/refrigeratorsAll')
      .post(users.requiresLogin, refrigerators.createAll);

	app.route('/refrigerators/:refrigeratorId')
		.get(refrigerators.read)
		.put(users.requiresLogin, refrigerators.hasAuthorization, refrigerators.update)
		.delete(users.requiresLogin, refrigerators.hasAuthorization, refrigerators.delete);

	// Finish by binding the Refrigerator middleware
	app.param('refrigeratorId', refrigerators.refrigeratorByID);
};
