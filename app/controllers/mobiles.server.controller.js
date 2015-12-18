'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Mobile = mongoose.model('Mobile'),
	_ = require('lodash');

/**
 * Create a Mobile
 */
exports.create = function(req, res) {
	var mobile = new Mobile(req.body);
	mobile.user = req.user;

	mobile.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mobile);
		}
	});
};

exports.createAll = function(req, res, next) {
  var importShops = (req.body);
  var bulk = Mobile.collection.initializeUnorderedBulkOp();
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
 * Show the current Mobile
 */
exports.read = function(req, res) {
	res.jsonp(req.mobile);
};

/**
 * Update a Mobile
 */
exports.update = function(req, res) {
	var mobile = req.mobile ;

	mobile = _.extend(mobile , req.body);

	mobile.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mobile);
		}
	});
};

/**
 * Delete an Mobile
 */
exports.delete = function(req, res) {
	var mobile = req.mobile ;

	mobile.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mobile);
		}
	});
};

/**
 * List of Mobiles
 */
exports.list = function(req, res) { 
	Mobile.find().sort('-created').populate('user', 'displayName').exec(function(err, mobiles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mobiles);
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
  var per_page = 12;
  Mobile.find().sort('-created').skip((page-1)*per_page).limit(per_page).exec(function(err, fruits) {
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
 * Mobile middleware
 */
exports.mobileByID = function(req, res, next, id) { 
	Mobile.findById(id).populate('user', 'displayName').exec(function(err, mobile) {
		if (err) return next(err);
		if (! mobile) return next(new Error('Failed to load Mobile ' + id));
		req.mobile = mobile ;
		next();
	});
};

/**
 * Mobile authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.mobile.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
