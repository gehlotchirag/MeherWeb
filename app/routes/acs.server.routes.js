'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var acs = require('../../app/controllers/acs.server.controller');

	// Acs Routes
	app.route('/acs')
		.get(acs.list)
		.post(users.requiresLogin, acs.create);

  app.route('/mobiles/acs/:page')
      .get(acs.listPage)

  app.route('/acsAll')
      .post(users.requiresLogin, acs.createAll);

	app.route('/acs/:acId')
		.get(acs.read)
		.put(users.requiresLogin, acs.hasAuthorization, acs.update)
		.delete(users.requiresLogin, acs.hasAuthorization, acs.delete);

	// Finish by binding the Ac middleware
	app.param('acId', acs.acByID);
};
