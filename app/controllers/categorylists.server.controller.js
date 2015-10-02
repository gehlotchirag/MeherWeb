'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Categorylist = mongoose.model('Categorylist'),
	_ = require('lodash');

/**
 * Create a Categorylist
 */
exports.create = function(req, res) {
	var categorylist = new Categorylist(req.body);
	categorylist.user = req.user;

	categorylist.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(categorylist);
		}
	});
};

/**
 * Show the current Categorylist
 */
exports.read = function(req, res) {
	res.jsonp(req.categorylist);
};

/**
 * Update a Categorylist
 */
exports.update = function(req, res) {
	var categorylist = req.categorylist ;

	categorylist = _.extend(categorylist , req.body);

	categorylist.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(categorylist);
		}
	});
};

/**
 * Delete an Categorylist
 */
exports.delete = function(req, res) {
	var categorylist = req.categorylist ;

	categorylist.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(categorylist);
		}
	});
};

/**
 * List of Categorylists
 */
exports.list = function(req, res) { 
	Categorylist.find().sort('-created').populate('user', 'displayName').exec(function(err, categorylists) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(categorylists);
		}
	});
};

/**
 * Categorylist middleware
 */
exports.categorylistByID = function(req, res, next, id) { 
	Categorylist.findById(id).populate('user', 'displayName').exec(function(err, categorylist) {
		if (err) return next(err);
		if (! categorylist) return next(new Error('Failed to load Categorylist ' + id));
		req.categorylist = categorylist ;
		next();
	});
};

/**
 * Categorylist authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.categorylist.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
