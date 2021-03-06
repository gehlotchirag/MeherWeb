'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var consumers = require('../../app/controllers/consumers.server.controller');

	// Consumers Routes
	app.route('/consumers')
		  .get(consumers.list)
		  .post(consumers.create);


  app.route('/consumers-referral/:referedBy')
      .get(consumers.refCount)

  app.route('/consumers-delete/:mobile')
      .get(consumers.deleteConsumer);

  app.route('/consumers-updatecoins/:consumermobile/:coins')
      .put(consumers.updateCoins);

  app.route('/consumers/:consumerId')
		.get(consumers.read)
		.put(users.requiresLogin, consumers.hasAuthorization, consumers.update)
		.delete(users.requiresLogin, consumers.hasAuthorization, consumers.delete);

	// Finish by binding the Consumer middleware
	app.param('consumerId', consumers.consumerByID);
  app.param('consumermobile',consumers.updateCoins);
  app.param('coins',consumers.updateCoins);
	app.param('referedBy', consumers.refCount);
  app.param('mobile',consumers.deleteConsumer);
};
