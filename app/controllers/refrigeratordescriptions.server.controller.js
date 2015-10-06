'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Refrigeratordescription = mongoose.model('Refrigeratordescription'),
	_ = require('lodash');

/**
 * Create a Refrigeratordescription
 */
exports.create = function(req, res) {
	var refrigeratordescription = new Refrigeratordescription(req.body);
	refrigeratordescription.user = req.user;

	refrigeratordescription.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(refrigeratordescription);
		}
	});
};

exports.createAll = function(req, res, next) {
  var importShops = (req.body);
  var bulk = Refrigeratordescription.collection.initializeUnorderedBulkOp();
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
  Refrigeratordescription.find({link:x.link}).sort('-created').populate('user', 'displayName').exec(function(err, mobiledescriptions) {
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
 * Show the current Refrigeratordescription
 */
exports.read = function(req, res) {
	res.jsonp(req.refrigeratordescription);
};

/**
 * Update a Refrigeratordescription
 */
exports.update = function(req, res) {
	var refrigeratordescription = req.refrigeratordescription ;

	refrigeratordescription = _.extend(refrigeratordescription , req.body);

	refrigeratordescription.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(refrigeratordescription);
		}
	});
};

/**
 * Delete an Refrigeratordescription
 */
exports.delete = function(req, res) {
	var refrigeratordescription = req.refrigeratordescription ;

	refrigeratordescription.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(refrigeratordescription);
		}
	});
};

/**
 * List of Refrigeratordescriptions
 */
exports.list = function(req, res) { 
	Refrigeratordescription.find().sort('-created').populate('user', 'displayName').exec(function(err, refrigeratordescriptions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(refrigeratordescriptions);
		}
	});
};

/**
 * Refrigeratordescription middleware
 */
exports.refrigeratordescriptionByID = function(req, res, next, id) { 
	Refrigeratordescription.findById(id).populate('user', 'displayName').exec(function(err, refrigeratordescription) {
		if (err) return next(err);
		if (! refrigeratordescription) return next(new Error('Failed to load Refrigeratordescription ' + id));
		req.refrigeratordescription = refrigeratordescription ;
		next();
	});
};

/**
 * Refrigeratordescription authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.refrigeratordescription.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
