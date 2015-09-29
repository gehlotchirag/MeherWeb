'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Vegetable = mongoose.model('Vegetable'),
	_ = require('lodash');

/**
 * Create a Vegetable
 */
exports.create = function(req, res) {
	var vegetable = new Vegetable(req.body);
	vegetable.user = req.user;

	vegetable.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vegetable);
		}
	});
};

/**
 * Show the current Vegetable
 */
exports.read = function(req, res) {
	res.jsonp(req.vegetable);
};

/**
 * Update a Vegetable
 */
exports.update = function(req, res) {
	var vegetable = req.vegetable ;

	vegetable = _.extend(vegetable , req.body);

	vegetable.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vegetable);
		}
	});
};

/**
 * Delete an Vegetable
 */
exports.delete = function(req, res) {
	var vegetable = req.vegetable ;

	vegetable.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vegetable);
		}
	});
};


exports.listPage = function(req, res) {
  if(!req.params.page)
  {
    var page = 1;
  }else{
    var page = req.params.page;
  }
  var per_page = 8;

  Vegetable.find().sort('-created').skip((page-1)*per_page).limit(per_page).exec(function(err, fruits) {
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
 * List of Vegetables
 */
exports.list = function(req, res) { 
	Vegetable.find().sort('-created').populate('user', 'displayName').exec(function(err, vegetables) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vegetables);
		}
	});
};

/**
 * Vegetable middleware
 */
exports.vegetableByID = function(req, res, next, id) { 
	Vegetable.findById(id).populate('user', 'displayName').exec(function(err, vegetable) {
		if (err) return next(err);
		if (! vegetable) return next(new Error('Failed to load Vegetable ' + id));
		req.vegetable = vegetable ;
		next();
	});
};

/**
 * Vegetable authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.vegetable.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
