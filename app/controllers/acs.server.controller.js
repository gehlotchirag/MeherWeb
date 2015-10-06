'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Ac = mongoose.model('Ac'),
	_ = require('lodash');

/**
 * Create a Ac
 */
exports.create = function(req, res) {
	var ac = new Ac(req.body);
	ac.user = req.user;

	ac.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ac);
		}
	});
};

exports.createAll = function(req, res, next) {
  var importShops = (req.body);
  var bulk = Ac.collection.initializeUnorderedBulkOp();
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
  Ac.find().sort('-created').skip((page-1)*per_page).limit(per_page).exec(function(err, fruits) {
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
 * Show the current Ac
 */
exports.read = function(req, res) {
	res.jsonp(req.ac);
};

/**
 * Update a Ac
 */
exports.update = function(req, res) {
	var ac = req.ac ;

	ac = _.extend(ac , req.body);

	ac.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ac);
		}
	});
};

/**
 * Delete an Ac
 */
exports.delete = function(req, res) {
	var ac = req.ac ;

	ac.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ac);
		}
	});
};

/**
 * List of Acs
 */
exports.list = function(req, res) { 
	Ac.find().sort('-created').populate('user', 'displayName').exec(function(err, acs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(acs);
		}
	});
};

/**
 * Ac middleware
 */
exports.acByID = function(req, res, next, id) { 
	Ac.findById(id).populate('user', 'displayName').exec(function(err, ac) {
		if (err) return next(err);
		if (! ac) return next(new Error('Failed to load Ac ' + id));
		req.ac = ac ;
		next();
	});
};

/**
 * Ac authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.ac.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
