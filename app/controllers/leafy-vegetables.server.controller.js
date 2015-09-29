'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	LeafyVegetable = mongoose.model('LeafyVegetable'),
	_ = require('lodash');

/**
 * Create a Leafy vegetable
 */
exports.create = function(req, res) {
	var leafyVegetable = new LeafyVegetable(req.body);
	leafyVegetable.user = req.user;

	leafyVegetable.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(leafyVegetable);
		}
	});
};

/**
 * Show the current Leafy vegetable
 */
exports.read = function(req, res) {
	res.jsonp(req.leafyVegetable);
};

/**
 * Update a Leafy vegetable
 */
exports.update = function(req, res) {
	var leafyVegetable = req.leafyVegetable ;

	leafyVegetable = _.extend(leafyVegetable , req.body);

	leafyVegetable.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(leafyVegetable);
		}
	});
};

/**
 * Delete an Leafy vegetable
 */
exports.delete = function(req, res) {
	var leafyVegetable = req.leafyVegetable ;

	leafyVegetable.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(leafyVegetable);
		}
	});
};
/**
 * List of Leafy vegetables
 */
exports.listPage = function(req, res) {
  if(!req.params.page)
  {
    var page = 1;
  }else{
    var page = req.params.page;
  }
  var per_page = 8;

  LeafyVegetable.find().sort('-created').skip((page-1)*per_page).limit(per_page).exec(function(err, fruits) {
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
 * List of Leafy vegetables
 */
exports.list = function(req, res) { 
	LeafyVegetable.find().sort('-created').populate('user', 'displayName').exec(function(err, leafyVegetables) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(leafyVegetables);
		}
	});
};

/**
 * Leafy vegetable middleware
 */
exports.leafyVegetableByID = function(req, res, next, id) { 
	LeafyVegetable.findById(id).populate('user', 'displayName').exec(function(err, leafyVegetable) {
		if (err) return next(err);
		if (! leafyVegetable) return next(new Error('Failed to load Leafy vegetable ' + id));
		req.leafyVegetable = leafyVegetable ;
		next();
	});
};

/**
 * Leafy vegetable authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.leafyVegetable.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
