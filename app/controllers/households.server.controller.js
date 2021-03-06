'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Household = mongoose.model('Household'),
	_ = require('lodash');

/**
 * Create a Household
 */
exports.create = function(req, res) {
	var household = new Household(req.body);
	household.user = req.user;

	household.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(household);
		}
	});
};

/**
 * Show the current Household
 */
exports.read = function(req, res) {
	res.jsonp(req.household);
};

/**
 * Update a Household
 */
exports.update = function(req, res) {
	var household = req.household ;

	household = _.extend(household , req.body);

	household.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(household);
		}
	});
};

/**
 * Delete an Household
 */
exports.delete = function(req, res) {
	var household = req.household ;

	household.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(household);
		}
	});
};

/**
 * List of Households
 */
exports.list = function(req, res) { 
	Household.find().sort('-created').populate('user', 'displayName').exec(function(err, households) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(households);
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
  var per_page = 12;
  Household.find().sort('-created').skip((page-1)*per_page).limit(per_page).exec(function(err, fruits) {
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
 * Household middleware
 */
exports.householdByID = function(req, res, next, id) { 
	Household.findById(id).populate('user', 'displayName').exec(function(err, household) {
		if (err) return next(err);
		if (! household) return next(new Error('Failed to load Household ' + id));
		req.household = household ;
		next();
	});
};

/**
 * Household authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.household.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
