'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var wmachines = require('../../app/controllers/wmachines.server.controller');

	// Wmachines Routes
	app.route('/wmachines')
		.get(wmachines.list)
		.post(users.requiresLogin, wmachines.create);

  app.route('/mobiles/wmachines/:page')
      .get(wmachines.listPage)

  app.route('/wmachinesAll')
      .post(users.requiresLogin, wmachines.createAll);

	app.route('/wmachines/:wmachineId')
		.get(wmachines.read)
		.put(users.requiresLogin, wmachines.hasAuthorization, wmachines.update)
		.delete(users.requiresLogin, wmachines.hasAuthorization, wmachines.delete);

	// Finish by binding the Wmachine middleware
	app.param('wmachineId', wmachines.wmachineByID);
};
