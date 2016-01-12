'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var tvs = require('../../app/controllers/tvs.server.controller');

	// Tvs Routes
	app.route('/tvs')
		.get(tvs.list)
		.post(users.requiresLogin, tvs.create);

  app.route('/mobiles/tvs/:page')
      .get(tvs.listPage)

  app.route('/tvsAll')
      .post(users.requiresLogin, tvs.createAll);

	app.route('/tvs/:tvId')
		.get(tvs.read)
		.put(users.requiresLogin, tvs.hasAuthorization, tvs.update)
		.delete(users.requiresLogin, tvs.hasAuthorization, tvs.delete);

	// Finish by binding the Tv middleware
	app.param('tvId', tvs.tvByID);
};
