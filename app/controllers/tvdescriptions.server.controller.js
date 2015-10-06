'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Tvdescription = mongoose.model('Tvdescription'),
	_ = require('lodash');

/**
 * Create a Tvdescription
 */
exports.create = function(req, res) {
	var tvdescription = new Tvdescription(req.body);
	tvdescription.user = req.user;

	tvdescription.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tvdescription);
		}
	});
};

exports.createAll = function(req, res, next) {
  var importShops = (req.body);
  var bulk = Tvdescription.collection.initializeUnorderedBulkOp();
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
 * Show the current Tvdescription
 */
exports.read = function(req, res) {
	res.jsonp(req.tvdescription);
};

/**
 * Update a Tvdescription
 */
exports.update = function(req, res) {
	var tvdescription = req.tvdescription ;

	tvdescription = _.extend(tvdescription , req.body);

	tvdescription.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tvdescription);
		}
	});
};

/**
 * Delete an Tvdescription
 */
exports.delete = function(req, res) {
	var tvdescription = req.tvdescription ;

	tvdescription.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tvdescription);
		}
	});
};

/**
 * List of Tvdescriptions
 */
exports.list = function(req, res) { 
	Tvdescription.find().sort('-created').populate('user', 'displayName').exec(function(err, tvdescriptions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tvdescriptions);
		}
	});
};

exports.listLink = function(req, res) {
  var x= (req.body);
  console.log(x.link);
  Tvdescription.find({link:x.link}).sort('-created').populate('user', 'displayName').exec(function(err, tvdescriptions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tvdescriptions);
    }
  });
};

/**
 * Tvdescription middleware
 */
exports.tvdescriptionByID = function(req, res, next, id) { 
	Tvdescription.findById(id).populate('user', 'displayName').exec(function(err, tvdescription) {
		if (err) return next(err);
		if (! tvdescription) return next(new Error('Failed to load Tvdescription ' + id));
		req.tvdescription = tvdescription ;
		next();
	});
};

/**
 * Tvdescription authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.tvdescription.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
