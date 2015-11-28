'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Fruit = mongoose.model('Fruit'),
	_ = require('lodash');

/**
 * Create a Fruit
 */
exports.create = function(req, res) {
	var fruit = new Fruit(req.body);
	fruit.user = req.user;

	fruit.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(fruit);
		}
	});
};

/**
 * Show the current Fruit
 */
exports.read = function(req, res) {
	res.jsonp(req.fruit);
};

/**
 * Update a Fruit
 */
exports.update = function(req, res) {
	var fruit = req.fruit ;

	fruit = _.extend(fruit , req.body);

	fruit.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(fruit);
		}
	});
};

/**
 * Delete an Fruit
 */
exports.delete = function(req, res) {
	var fruit = req.fruit ;

	fruit.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(fruit);
		}
	});
};

/**
 * List of Fruits
 */
exports.list = function(req, res) { 
	Fruit.find().sort('-created').populate('user', 'displayName').exec(function(err, fruits) {
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
 * List of Fruits
 */
exports.listPage = function(req, res) {
  if(!req.params.page)
  {
    var page = 1;
  }else{
    var page = req.params.page;
  }
  var per_page = 8;

  Fruit.find().sort('-created').skip((page-1)*per_page).limit(per_page).exec(function(err, fruits) {
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
 * Fruit middleware
 */
exports.fruitByID = function(req, res, next, id) { 
	Fruit.findById(id).populate('user', 'displayName').exec(function(err, fruit) {
		if (err) return next(err);
		if (! fruit) return next(new Error('Failed to load Fruit ' + id));
		req.fruit = fruit ;
		next();
	});
};

/**
 * Fruit authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	//if (req.shopGrocery.user.id !== req.user.id) {
	if ('gehlotchirag@gmail.com' !== req.user.email) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
