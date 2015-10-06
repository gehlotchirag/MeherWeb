'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var refrigeratordescriptions = require('../../app/controllers/refrigeratordescriptions.server.controller');

	// Refrigeratordescriptions Routes
	app.route('/refrigeratordescriptions')
		.get(refrigeratordescriptions.list)
		.post(users.requiresLogin, refrigeratordescriptions.create);

  app.route('/refrigeratordescriptionsAll')
      .post(users.requiresLogin, refrigeratordescriptions.createAll);

  app.route('/refrigeratordescriptionslink/')
      .post(refrigeratordescriptions.listLink);

	app.route('/refrigeratordescriptions/:refrigeratordescriptionId')
		.get(refrigeratordescriptions.read)
		.put(users.requiresLogin, refrigeratordescriptions.hasAuthorization, refrigeratordescriptions.update)
		.delete(users.requiresLogin, refrigeratordescriptions.hasAuthorization, refrigeratordescriptions.delete);

	// Finish by binding the Refrigeratordescription middleware
	app.param('refrigeratordescriptionId', refrigeratordescriptions.refrigeratordescriptionByID);
};
