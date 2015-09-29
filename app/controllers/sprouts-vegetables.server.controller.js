'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	SproutsVegetable = mongoose.model('SproutsVegetable'),
	_ = require('lodash');

/**
 * Create a Sprouts vegetable
 */
exports.create = function(req, res) {
	var sproutsVegetable = new SproutsVegetable(req.body);
	sproutsVegetable.user = req.user;

	sproutsVegetable.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sproutsVegetable);
		}
	});
};

/**
 * Show the current Sprouts vegetable
 */
exports.read = function(req, res) {
	res.jsonp(req.sproutsVegetable);
};

/**
 * Update a Sprouts vegetable
 */
exports.update = function(req, res) {
	var sproutsVegetable = req.sproutsVegetable ;

	sproutsVegetable = _.extend(sproutsVegetable , req.body);

	sproutsVegetable.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sproutsVegetable);
		}
	});
};

/**
 * Delete an Sprouts vegetable
 */
exports.delete = function(req, res) {
	var sproutsVegetable = req.sproutsVegetable ;

	sproutsVegetable.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sproutsVegetable);
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

  SproutsVegetable.find().sort('-created').skip((page-1)*per_page).limit(per_page).exec(function(err, fruits) {
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
 * List of Sprouts vegetables
 */
exports.list = function(req, res) { 
	SproutsVegetable.find().sort('-created').populate('user', 'displayName').exec(function(err, sproutsVegetables) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sproutsVegetables);
		}
	});
};

/**
 * Sprouts vegetable middleware
 */
exports.sproutsVegetableByID = function(req, res, next, id) { 
	SproutsVegetable.findById(id).populate('user', 'displayName').exec(function(err, sproutsVegetable) {
		if (err) return next(err);
		if (! sproutsVegetable) return next(new Error('Failed to load Sprouts vegetable ' + id));
		req.sproutsVegetable = sproutsVegetable ;
		next();
	});
};

/**
 * Sprouts vegetable authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.sproutsVegetable.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
