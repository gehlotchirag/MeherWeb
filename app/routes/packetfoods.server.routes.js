'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var packetfoods = require('../../app/controllers/packetfoods.server.controller');

	// Packetfoods Routes
	app.route('/packetfoods')
		.get(packetfoods.list)
		.post(users.requiresLogin, packetfoods.create);

  app.route('/packetfoods/page/:page')
      .get(packetfoods.listPage);

	app.route('/packetfoods/:packetfoodId')
		.get(packetfoods.read)
		.put(users.requiresLogin, packetfoods.hasAuthorization, packetfoods.update)
		.delete(users.requiresLogin, packetfoods.delete);

	// Finish by binding the Packetfood middleware
	app.param('packetfoodId', packetfoods.packetfoodByID);
};
