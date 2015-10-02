'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Packetfood = mongoose.model('Packetfood'),
	_ = require('lodash');

/**
 * Create a Packetfood
 */
exports.create = function(req, res) {
	var packetfood = new Packetfood(req.body);
	packetfood.user = req.user;

	packetfood.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(packetfood);
		}
	});
};

/**
 * Show the current Packetfood
 */
exports.read = function(req, res) {
	res.jsonp(req.packetfood);
};

/**
 * Update a Packetfood
 */
exports.update = function(req, res) {
	var packetfood = req.packetfood ;

	packetfood = _.extend(packetfood , req.body);

	packetfood.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(packetfood);
		}
	});
};

/**
 * Delete an Packetfood
 */
exports.delete = function(req, res) {
	var packetfood = req.packetfood ;

	packetfood.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(packetfood);
		}
	});
};

/**
 * List of Packetfoods
 */
exports.list = function(req, res) { 
	Packetfood.find().sort('-created').populate('user', 'displayName').exec(function(err, packetfoods) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(packetfoods);
		}
	});
};

/**
 * List of pagination
 */
exports.listPage = function(req, res) {
  if(!req.params.page)
  {
    var page = 1;
  }else{
    var page = req.params.page;
  }
  var per_page = 8;
  Packetfood.find().sort('-created').skip((page-1)*per_page).limit(per_page).exec(function(err, fruits) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(fruits);
    }
  });
};

/**
 * Packetfood middleware
 */
exports.packetfoodByID = function(req, res, next, id) { 
	Packetfood.findById(id).populate('user', 'displayName').exec(function(err, packetfood) {
		if (err) return next(err);
		if (! packetfood) return next(new Error('Failed to load Packetfood ' + id));
		req.packetfood = packetfood ;
		next();
	});
};

/**
 * Packetfood authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.packetfood.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
