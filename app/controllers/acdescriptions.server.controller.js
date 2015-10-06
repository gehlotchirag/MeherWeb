'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Acdescription = mongoose.model('Acdescription'),
	_ = require('lodash');

/**
 * Create a Acdescription
 */
exports.create = function(req, res) {
	var acdescription = new Acdescription(req.body);
	acdescription.user = req.user;

	acdescription.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(acdescription);
		}
	});
};


exports.createAll = function(req, res, next) {
  var importShops = (req.body);
  var bulk = Acdescription.collection.initializeUnorderedBulkOp();
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
  Acdescription.find({link:x.link}).sort('-created').populate('user', 'displayName').exec(function(err, mobiledescriptions) {
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
 * Show the current Acdescription
 */
exports.read = function(req, res) {
	res.jsonp(req.acdescription);
};

/**
 * Update a Acdescription
 */
exports.update = function(req, res) {
	var acdescription = req.acdescription ;

	acdescription = _.extend(acdescription , req.body);

	acdescription.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(acdescription);
		}
	});
};

/**
 * Delete an Acdescription
 */
exports.delete = function(req, res) {
	var acdescription = req.acdescription ;

	acdescription.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(acdescription);
		}
	});
};

/**
 * List of Acdescriptions
 */
exports.list = function(req, res) { 
	Acdescription.find().sort('-created').populate('user', 'displayName').exec(function(err, acdescriptions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(acdescriptions);
		}
	});
};

/**
 * Acdescription middleware
 */
exports.acdescriptionByID = function(req, res, next, id) { 
	Acdescription.findById(id).populate('user', 'displayName').exec(function(err, acdescription) {
		if (err) return next(err);
		if (! acdescription) return next(new Error('Failed to load Acdescription ' + id));
		req.acdescription = acdescription ;
		next();
	});
};

/**
 * Acdescription authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.acdescription.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
