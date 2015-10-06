'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var wmachinedescriptions = require('../../app/controllers/wmachinedescriptions.server.controller');

	// Wmachinedescriptions Routes
	app.route('/wmachinedescriptions')
		.get(wmachinedescriptions.list)
		.post(users.requiresLogin, wmachinedescriptions.create);

  app.route('/wmachinedescriptionsAll')
      .post(users.requiresLogin, wmachinedescriptions.createAll);

  app.route('/wmachinedescriptionslink/')
      .post(wmachinedescriptions.listLink);

	app.route('/wmachinedescriptions/:wmachinedescriptionId')
		.get(wmachinedescriptions.read)
		.put(users.requiresLogin, wmachinedescriptions.hasAuthorization, wmachinedescriptions.update)
		.delete(users.requiresLogin, wmachinedescriptions.hasAuthorization, wmachinedescriptions.delete);

	// Finish by binding the Wmachinedescription middleware
	app.param('wmachinedescriptionId', wmachinedescriptions.wmachinedescriptionByID);
};
