'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var reminders = require('../../app/controllers/reminders.server.controller');

	// Reminders Routes
	app.route('/reminders')
		.get(reminders.list)
		.post(users.requiresLogin, reminders.create);

	app.route('/reminders/:reminderId')
		.get(reminders.read)
		.put(users.requiresLogin, reminders.hasAuthorization, reminders.update)
		.delete(users.requiresLogin, reminders.hasAuthorization, reminders.delete);

	// Finish by binding the Reminder middleware
	app.param('reminderId', reminders.reminderByID);
};
