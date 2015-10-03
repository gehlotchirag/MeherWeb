'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ShopMedical = mongoose.model('ShopMedical'),
	_ = require('lodash');

/**
 * Create a Shop medical
 */
exports.create = function(req, res) {
	var shopMedical = new ShopMedical(req.body);
	shopMedical.user = req.user;

	shopMedical.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shopMedical);
		}
	});
};

exports.createAll = function(req, res, next) {
  var importShops = (req.body);
  var bulk = ShopMedical.collection.initializeUnorderedBulkOp();
  importShops.forEach(function(shop) {
    if (shop)
      bulk.insert(shop);
  })
  bulk.execute(function (err,result) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(result);
    }
  });
};

/**
 * Show the current Shop medical
 */
exports.read = function(req, res) {
	res.jsonp(req.shopMedical);
};

/**
 * Update a Shop medical
 */
exports.update = function(req, res) {
	var shopMedical = req.shopMedical ;

	shopMedical = _.extend(shopMedical , req.body);

	shopMedical.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shopMedical);
		}
	});
};

/**
 * Delete an Shop medical
 */
exports.delete = function(req, res) {
	var shopMedical = req.shopMedical ;

	shopMedical.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shopMedical);
		}
	});
};

/**
 * List of Shop medicals
 */
exports.list = function(req, res) { 
	ShopMedical.find().sort('-created').populate('user', 'displayName').exec(function(err, shopMedicals) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shopMedicals);
		}
	});
};

/**
 * Shop medical middleware
 */
exports.shopMedicalByID = function(req, res, next, id) { 
	ShopMedical.findById(id).populate('user', 'displayName').exec(function(err, shopMedical) {
		if (err) return next(err);
		if (! shopMedical) return next(new Error('Failed to load Shop medical ' + id));
		req.shopMedical = shopMedical ;
		next();
	});
};

/**
 * Shop medical authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.shopMedical.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
