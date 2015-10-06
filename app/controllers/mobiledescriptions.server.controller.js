'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Mobiledescription = mongoose.model('Mobiledescription'),
	_ = require('lodash');

/**
 * Create a Mobiledescription
 */
exports.create = function(req, res) {
	var mobiledescription = new Mobiledescription(req.body);
	mobiledescription.user = req.user;

	mobiledescription.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mobiledescription);
		}
	});
};

exports.createAll = function(req, res, next) {
  var importShops = (req.body);
  var bulk = Mobiledescription.collection.initializeUnorderedBulkOp();
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
 * Show the current Mobiledescription
 */
exports.read = function(req, res) {
	res.jsonp(req.mobiledescription);
};

/**
 * Update a Mobiledescription
 */
exports.update = function(req, res) {
	var mobiledescription = req.mobiledescription ;

	mobiledescription = _.extend(mobiledescription , req.body);

	mobiledescription.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mobiledescription);
		}
	});
};

/**
 * Delete an Mobiledescription
 */
exports.delete = function(req, res) {
	var mobiledescription = req.mobiledescription ;

	mobiledescription.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mobiledescription);
		}
	});
};

/**
 * List of Mobiledescriptions
 */
exports.list = function(req, res) { 
	Mobiledescription.find().sort('-created').populate('user', 'displayName').exec(function(err, mobiledescriptions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mobiledescriptions);
		}
	});
};

exports.listLink = function(req, res) {
  var x= (req.body);
  console.log(x.link);
  Mobiledescription.find({link:x.link}).sort('-created').populate('user', 'displayName').exec(function(err, mobiledescriptions) {
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
 * Mobiledescription middleware
 */
exports.mobiledescriptionByID = function(req, res, next, id) {
	Mobiledescription.findById(id).exec(function(err, mobiledescription) {
		if (err) return next(err);
		if (! mobiledescription) return next(new Error('Failed to load Mobiledescription ' + id));
		req.mobiledescription = mobiledescription ;
		next();
	});
};

//exports.mobiledescriptionByLink = function(req, res, next, id) {
//  Mobiledescription.find({ link: 'wds' }).exec(function(err, mobiledescription) {
//    if (err) return next(err);
//    if (! mobiledescription) return next(new Error('Failed to load Mobiledescription ' + id));
//    req.mobiledescription = mobiledescription ;
//    next();
//  });
//};



/**
 * Mobiledescription authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.mobiledescription.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
