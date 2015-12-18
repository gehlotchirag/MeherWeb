'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Grocery = mongoose.model('Grocery'),
	_ = require('lodash');

/**
 * Create a Grocery
 */
exports.create = function(req, res) {
	var grocery = new Grocery(req.body);
	grocery.user = req.user;

	grocery.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grocery);
		}
	});
};

/**
 * Show the current Grocery
 */
exports.read = function(req, res) {
	res.jsonp(req.grocery);
};

/**
 * Update a Grocery
 */
exports.update = function(req, res) {
	var grocery = req.grocery ;

	grocery = _.extend(grocery , req.body);

	grocery.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grocery);
		}
	});
};

/**
 * Delete an Grocery
 */
exports.delete = function(req, res) {
	var grocery = req.grocery ;

	grocery.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grocery);
		}
	});
};

/**
 * List of Groceries
 */
exports.list = function(req, res) { 
	Grocery.find().sort('-created').populate('user', 'displayName').exec(function(err, groceries) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(groceries);
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
  Grocery.find().sort('-created').skip((page-1)*per_page).limit(per_page).exec(function(err, fruits) {
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
 * Grocery middleware
 */
exports.groceryByID = function(req, res, next, id) { 
	Grocery.findById(id).populate('user', 'displayName').exec(function(err, grocery) {
		if (err) return next(err);
		if (! grocery) return next(new Error('Failed to load Grocery ' + id));
		req.grocery = grocery ;
		next();
	});
};

/**
 * Grocery authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.grocery.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
