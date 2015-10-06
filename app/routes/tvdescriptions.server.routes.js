'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var tvdescriptions = require('../../app/controllers/tvdescriptions.server.controller');

	// Tvdescriptions Routes
	app.route('/tvdescriptions')
		.get(tvdescriptions.list)
		.post(users.requiresLogin, tvdescriptions.create);

  app.route('/tvdescriptionsAll')
      .post(users.requiresLogin, tvdescriptions.createAll);

  app.route('/tvdescriptionslink/')
      .post(tvdescriptions.listLink);

  app.route('/tvdescriptions/:tvdescriptionId')
		.get(tvdescriptions.read)
		.put(users.requiresLogin, tvdescriptions.hasAuthorization, tvdescriptions.update)
		.delete(users.requiresLogin, tvdescriptions.hasAuthorization, tvdescriptions.delete);

	// Finish by binding the Tvdescription middleware
	app.param('tvdescriptionId', tvdescriptions.tvdescriptionByID);
};
