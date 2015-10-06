'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var acdescriptions = require('../../app/controllers/acdescriptions.server.controller');

	// Acdescriptions Routes
	app.route('/acdescriptions')
		.get(acdescriptions.list)
		.post(users.requiresLogin, acdescriptions.create);

  app.route('/acdescriptionsAll')
      .post(users.requiresLogin, acdescriptions.createAll);

  app.route('/acdescriptionslink/')
      .post(acdescriptions.listLink);

	app.route('/acdescriptions/:acdescriptionId')
		.get(acdescriptions.read)
		.put(users.requiresLogin, acdescriptions.hasAuthorization, acdescriptions.update)
		.delete(users.requiresLogin, acdescriptions.hasAuthorization, acdescriptions.delete);

	// Finish by binding the Acdescription middleware
	app.param('acdescriptionId', acdescriptions.acdescriptionByID);
};
