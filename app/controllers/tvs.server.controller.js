'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Tv = mongoose.model('Tv'),
	_ = require('lodash');

/**
 * Create a Tv
 */
exports.create = function(req, res) {
	var tv = new Tv(req.body);
	tv.user = req.user;
	tv.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tv);
		}
	});
};

/**
 * Show the current Tv
 */
exports.read = function(req, res) {
	res.jsonp(req.tv);
};

/**
 * Update a Tv
 */
exports.update = function(req, res) {
	var tv = req.tv ;

	tv = _.extend(tv , req.body);

	tv.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tv);
		}
	});
};

/**
 * Delete an Tv
 */
exports.delete = function(req, res) {
	var tv = req.tv ;

	tv.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tv);
		}
	});
};

/**
 * List of Tvs
 */
exports.list = function(req, res) { 
	Tv.find().sort('-created').populate('user', 'displayName').exec(function(err, tvs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tvs);
		}
	});
};

exports.createAll = function(req, res, next) {
  var importShops = (req.body);
  var bulk = Tv.collection.initializeUnorderedBulkOp();
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


exports.listPage = function(req, res) {
  if(!req.params.page)
  {
    var page = 1;
  }else{
    var page = req.params.page;
  }
  var per_page = 8;
  Tv.find().sort('-created').skip((page-1)*per_page).limit(per_page).exec(function(err, fruits) {
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
 * Tv middleware
 */
exports.tvByID = function(req, res, next, id) { 
	Tv.findById(id).populate('user', 'displayName').exec(function(err, tv) {
		if (err) return next(err);
		if (! tv) return next(new Error('Failed to load Tv ' + id));
		req.tv = tv ;
		next();
	});
};

/**
 * Tv authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.tv.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
