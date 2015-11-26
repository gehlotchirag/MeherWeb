'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Calldetail = mongoose.model('Calldetail'),
	_ = require('lodash');

/**
 * Create a Calldetail
 */
exports.create = function(req, res) {
	var calldetail = new Calldetail(req.body);
	calldetail.user = req.user;

	calldetail.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calldetail);
		}
	});
};

/**
 * Show the current Calldetail
 */
exports.read = function(req, res) {
	res.jsonp(req.calldetail);
};

/**
 * Update a Calldetail
 */
exports.update = function(req, res) {
	var calldetail = req.calldetail ;

	calldetail = _.extend(calldetail , req.body);

	calldetail.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calldetail);
		}
	});
};

/**
 * Delete an Calldetail
 */
exports.delete = function(req, res) {
	var calldetail = req.calldetail ;

	calldetail.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calldetail);
		}
	});
};

/**
 * List of Calldetails
 */
exports.list = function(req, res) { 
	Calldetail.find().sort('-created').populate('user', 'displayName').exec(function(err, calldetails) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calldetails);
		}
	});
};

/**
 * Calldetail middleware
 */
exports.calldetailByID = function(req, res, next, id) { 
	Calldetail.findById(id).populate('user', 'displayName').exec(function(err, calldetail) {
		if (err) return next(err);
		if (! calldetail) return next(new Error('Failed to load Calldetail ' + id));
		req.calldetail = calldetail ;
		next();
	});
};

/**
 * Calldetail authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.calldetail.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
