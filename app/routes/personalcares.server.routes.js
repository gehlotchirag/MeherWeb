'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var personalcares = require('../../app/controllers/personalcares.server.controller');

	// Personalcares Routes
	app.route('/personalcares')
		.get(personalcares.list)
		.post(users.requiresLogin, personalcares.create);

  app.route('/personalcares/page/:page')
      .get(personalcares.listPage);

  app.route('/personalcares/:personalcareId')
		.get(personalcares.read)
		.put(users.requiresLogin, personalcares.hasAuthorization, personalcares.update)
		.delete(users.requiresLogin, personalcares.delete);

	// Finish by binding the Personalcare middleware
	app.param('personalcareId', personalcares.personalcareByID);
};
