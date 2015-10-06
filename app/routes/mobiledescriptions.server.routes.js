'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var mobiledescriptions = require('../../app/controllers/mobiledescriptions.server.controller');

	// Mobiledescriptions Routes
	app.route('/mobiledescriptions')
		.get(mobiledescriptions.list)
		.post(users.requiresLogin, mobiledescriptions.create);

  app.route('/mobiledescriptionsAll')
      .post(users.requiresLogin, mobiledescriptions.createAll);

  app.route('/mobilelink/')
      .post(mobiledescriptions.listLink);

	app.route('/mobiledescriptions/:mobiledescriptionId')
		.get(mobiledescriptions.read)
		.put(users.requiresLogin, mobiledescriptions.hasAuthorization, mobiledescriptions.update)
		.delete(users.requiresLogin, mobiledescriptions.hasAuthorization, mobiledescriptions.delete);

	// Finish by binding the Mobiledescription middleware
  app.param('mobiledescriptionId', mobiledescriptions.mobiledescriptionByID);
};
