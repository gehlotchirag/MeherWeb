'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Refrigerator = mongoose.model('Refrigerator'),
	_ = require('lodash');

/**
 * Create a Refrigerator
 */
exports.create = function(req, res) {
	var refrigerator = new Refrigerator(req.body);
	refrigerator.user = req.user;

	refrigerator.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(refrigerator);
		}
	});
};

exports.createAll = function(req, res, next) {
  var importShops = (req.body);
  var bulk = Refrigerator.collection.initializeUnorderedBulkOp();
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
  Refrigerator.find().sort('-created').skip((page-1)*per_page).limit(per_page).exec(function(err, fruits) {
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
 * Show the current Refrigerator
 */
exports.read = function(req, res) {
	res.jsonp(req.refrigerator);
};

/**
 * Update a Refrigerator
 */
exports.update = function(req, res) {
	var refrigerator = req.refrigerator ;

	refrigerator = _.extend(refrigerator , req.body);

	refrigerator.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(refrigerator);
		}
	});
};

/**
 * Delete an Refrigerator
 */
exports.delete = function(req, res) {
	var refrigerator = req.refrigerator ;

	refrigerator.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(refrigerator);
		}
	});
};

/**
 * List of Refrigerators
 */
exports.list = function(req, res) { 
	Refrigerator.find().sort('-created').populate('user', 'displayName').exec(function(err, refrigerators) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(refrigerators);
		}
	});
};

/**
 * Refrigerator middleware
 */
exports.refrigeratorByID = function(req, res, next, id) { 
	Refrigerator.findById(id).populate('user', 'displayName').exec(function(err, refrigerator) {
		if (err) return next(err);
		if (! refrigerator) return next(new Error('Failed to load Refrigerator ' + id));
		req.refrigerator = refrigerator ;
		next();
	});
};

/**
 * Refrigerator authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.refrigerator.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
