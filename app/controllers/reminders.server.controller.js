'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Reminder = mongoose.model('Reminder'),
	_ = require('lodash');

/**
 * Create a Reminder
 */
exports.create = function(req, res) {
	var reminder = new Reminder(req.body);
	reminder.user = req.user;

	reminder.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reminder);
		}
	});
};

/**
 * Show the current Reminder
 */
exports.read = function(req, res) {
	res.jsonp(req.reminder);
};

/**
 * Update a Reminder
 */
exports.update = function(req, res) {
	var reminder = req.reminder ;

	reminder = _.extend(reminder , req.body);

	reminder.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reminder);
		}
	});
};

/**
 * Delete an Reminder
 */
exports.delete = function(req, res) {
	var reminder = req.reminder ;

	reminder.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reminder);
		}
	});
};

/**
 * List of Reminders
 */
exports.list = function(req, res) { 
	Reminder.find().sort('-created').populate('user', 'displayName').exec(function(err, reminders) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reminders);
		}
	});
};

/**
 * Reminder middleware
 */
exports.reminderByID = function(req, res, next, id) { 
	Reminder.findById(id).populate('user', 'displayName').exec(function(err, reminder) {
		if (err) return next(err);
		if (! reminder) return next(new Error('Failed to load Reminder ' + id));
		req.reminder = reminder ;
		next();
	});
};

/**
 * Reminder authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.reminder.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
