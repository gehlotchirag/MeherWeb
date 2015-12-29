'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var consumers = require('../../app/controllers/consumers.server.controller');

	// Consumers Routes
	app.route('/consumers')
		.get(consumers.list)
		.post(consumers.create);

  app.route('/consumers/:referedBy')
      .get(consumers.refCount)


	app.route('/consumers/:consumerId')
		.get(consumers.read)
		.put(users.requiresLogin, consumers.hasAuthorization, consumers.update)
		.delete(users.requiresLogin, consumers.hasAuthorization, consumers.delete);

	// Finish by binding the Consumer middleware
	app.param('consumerId', consumers.consumerByID);
	app.param('referedBy', consumers.refCount);
};
