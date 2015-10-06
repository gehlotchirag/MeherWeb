'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var mobiles = require('../../app/controllers/mobiles.server.controller');

	// Mobiles Routes
	app.route('/mobiles')
		.get(mobiles.list)
		.post(users.requiresLogin, mobiles.create);

  app.route('/mobiles/page/:page')
      .get(mobiles.listPage)

  app.route('/mobilesAll')
      .post(users.requiresLogin, mobiles.createAll);

  app.route('/mobiles/:mobileId')
		.get(mobiles.read)
		.put(users.requiresLogin, mobiles.hasAuthorization, mobiles.update)
		.delete(users.requiresLogin, mobiles.hasAuthorization, mobiles.delete);

	// Finish by binding the Mobile middleware
	app.param('mobileId', mobiles.mobileByID);
};
