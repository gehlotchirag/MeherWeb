'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Wmachinedescription = mongoose.model('Wmachinedescription'),
	_ = require('lodash');

/**
 * Create a Wmachinedescription
 */
exports.create = function(req, res) {
	var wmachinedescription = new Wmachinedescription(req.body);
	wmachinedescription.user = req.user;

	wmachinedescription.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wmachinedescription);
		}
	});
};


exports.createAll = function(req, res, next) {
  var importShops = (req.body);
  var bulk = Wmachinedescription.collection.initializeUnorderedBulkOp();
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

exports.listLink = function(req, res) {
  var x= (req.body);
  console.log(x.link);
  Wmachinedescription.find({link:x.link}).sort('-created').populate('user', 'displayName').exec(function(err, mobiledescriptions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mobiledescriptions);
    }
  });
};

/**
 * Show the current Wmachinedescription
 */
exports.read = function(req, res) {
	res.jsonp(req.wmachinedescription);
};

/**
 * Update a Wmachinedescription
 */
exports.update = function(req, res) {
	var wmachinedescription = req.wmachinedescription ;

	wmachinedescription = _.extend(wmachinedescription , req.body);

	wmachinedescription.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wmachinedescription);
		}
	});
};

/**
 * Delete an Wmachinedescription
 */
exports.delete = function(req, res) {
	var wmachinedescription = req.wmachinedescription ;

	wmachinedescription.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wmachinedescription);
		}
	});
};

/**
 * List of Wmachinedescriptions
 */
exports.list = function(req, res) { 
	Wmachinedescription.find().sort('-created').populate('user', 'displayName').exec(function(err, wmachinedescriptions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wmachinedescriptions);
		}
	});
};

/**
 * Wmachinedescription middleware
 */
exports.wmachinedescriptionByID = function(req, res, next, id) { 
	Wmachinedescription.findById(id).populate('user', 'displayName').exec(function(err, wmachinedescription) {
		if (err) return next(err);
		if (! wmachinedescription) return next(new Error('Failed to load Wmachinedescription ' + id));
		req.wmachinedescription = wmachinedescription ;
		next();
	});
};

/**
 * Wmachinedescription authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.wmachinedescription.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
