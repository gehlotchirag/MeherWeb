'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var calldetails = require('../../app/controllers/calldetails.server.controller');

	// Calldetails Routes
	app.route('/calldetails')
		.get(calldetails.list)
		.post(users.requiresLogin, calldetails.create);

	app.route('/calldetails/:calldetailId')
		.get(calldetails.read)
		.put(users.requiresLogin, calldetails.hasAuthorization, calldetails.update)
		.delete(users.requiresLogin, calldetails.hasAuthorization, calldetails.delete);

	// Finish by binding the Calldetail middleware
	app.param('calldetailId', calldetails.calldetailByID);
};
