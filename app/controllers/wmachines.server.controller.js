'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Wmachine = mongoose.model('Wmachine'),
	_ = require('lodash');

/**
 * Create a Wmachine
 */
exports.create = function(req, res) {
	var wmachine = new Wmachine(req.body);
	wmachine.user = req.user;

	wmachine.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wmachine);
		}
	});
};

/**
 * Show the current Wmachine
 */
exports.read = function(req, res) {
	res.jsonp(req.wmachine);
};

/**
 * Update a Wmachine
 */
exports.update = function(req, res) {
	var wmachine = req.wmachine ;

	wmachine = _.extend(wmachine , req.body);

	wmachine.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wmachine);
		}
	});
};

/**
 * Delete an Wmachine
 */
exports.delete = function(req, res) {
	var wmachine = req.wmachine ;

	wmachine.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wmachine);
		}
	});
};

/**
 * List of Wmachines
 */
exports.list = function(req, res) { 
	Wmachine.find().sort('-created').populate('user', 'displayName').exec(function(err, wmachines) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wmachines);
		}
	});
};


exports.createAll = function(req, res, next) {
  var importShops = (req.body);
  var bulk = Wmachine.collection.initializeUnorderedBulkOp();
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
  var per_page = 12;
  Wmachine.find().sort('-created').skip((page-1)*per_page).limit(per_page).exec(function(err, fruits) {
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
 * Wmachine middleware
 */
exports.wmachineByID = function(req, res, next, id) { 
	Wmachine.findById(id).populate('user', 'displayName').exec(function(err, wmachine) {
		if (err) return next(err);
		if (! wmachine) return next(new Error('Failed to load Wmachine ' + id));
		req.wmachine = wmachine ;
		next();
	});
};

/**
 * Wmachine authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.wmachine.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
