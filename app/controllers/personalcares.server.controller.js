'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Personalcare = mongoose.model('Personalcare'),
	_ = require('lodash');

/**
 * Create a Personalcare
 */
exports.create = function(req, res) {
	var personalcare = new Personalcare(req.body);
	personalcare.user = req.user;

	personalcare.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(personalcare);
		}
	});
};

/**
 * Show the current Personalcare
 */
exports.read = function(req, res) {
	res.jsonp(req.personalcare);
};

/**
 * Update a Personalcare
 */
exports.update = function(req, res) {
	var personalcare = req.personalcare ;

	personalcare = _.extend(personalcare , req.body);

	personalcare.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(personalcare);
		}
	});
};

/**
 * Delete an Personalcare
 */
exports.delete = function(req, res) {
	var personalcare = req.personalcare ;

	personalcare.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(personalcare);
		}
	});
};

/**
 * List of Personalcares
 */
exports.list = function(req, res) { 
	Personalcare.find().sort('-created').populate('user', 'displayName').exec(function(err, personalcares) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(personalcares);
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
  Personalcare.find().sort('-created').skip((page-1)*per_page).limit(per_page).exec(function(err, fruits) {
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
 * Personalcare middleware
 */
exports.personalcareByID = function(req, res, next, id) { 
	Personalcare.findById(id).populate('user', 'displayName').exec(function(err, personalcare) {
		if (err) return next(err);
		if (! personalcare) return next(new Error('Failed to load Personalcare ' + id));
		req.personalcare = personalcare ;
		next();
	});
};

/**
 * Personalcare authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.personalcare.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
