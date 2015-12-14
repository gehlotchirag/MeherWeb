'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ShopGrocery = mongoose.model('ShopGrocery'),
	_ = require('lodash');

/**
 * Create a Shop grocery
 */
exports.create = function(req, res) {
	var shopGrocery = new ShopGrocery(req.body);

	shopGrocery.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shopGrocery);
		}
	});

};

exports.createAll = function(req, res, next) {
  var importShops = req.body;
  console.log(importShops)
  var bulk = ShopGrocery.collection.initializeUnorderedBulkOp();
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
 * Show the current Shop grocery
 */
exports.read = function(req, res) {
	res.jsonp(req.shopGrocery);
};

/**
 * Update a Shop grocery
 */
exports.update = function(req, res) {
	var shopGrocery = req.shopGrocery ;

	shopGrocery = _.extend(shopGrocery , req.body);

	shopGrocery.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shopGrocery);
		}
	});
};

/**
 * Delete an Shop grocery
 */
exports.delete = function(req, res) {
	var shopGrocery = req.shopGrocery ;

	shopGrocery.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shopGrocery);
		}
	});
};

/**
 * List of Shop groceries
 */
exports.list = function(req, res) { 
	ShopGrocery.find().sort('-created').populate('user', 'displayName').exec(function(err, shopGroceries) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shopGroceries);
		}
	});
};

exports.listNear = function(req, res) {
  if(!req.params.page)
  {
    var page = 1;
  }else{
    var page = req.params.page;
  }
  var per_page = 10;

  ShopGrocery.find(
      {
        loc:
        { $near :
        {
          $geometry: { type: "Point",  coordinates: [ req.params.lng, req.params.lat ] },
          $maxDistance: 5000
        }
        }
      }
  ).skip((page-1)*per_page).limit(per_page).exec(function(err, shopGroceries) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(shopGroceries);
    }
  });
};

/**
 * Shop grocery middleware
 */
exports.shopGroceryByID = function(req, res, next, id) {
	ShopGrocery.findById(id).populate('user', 'displayName').exec(function(err, shopGrocery) {
		if (err) return next(err);
		if (! shopGrocery) return next(new Error('Failed to load Shop grocery ' + id));
		req.shopGrocery = shopGrocery ;
		next();
	});
};

/**
 * Shop grocery middleware
 */
exports.shopGroceryByMobile= function(req, res) {
  ShopGrocery.findOneAndUpdate({ mobile: req.params.mobile },{deviceId: req.params.deviceId}).exec(function(err, shopGrocery) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(shopGrocery);
    }
  });
};

exports.listByDevice = function(req, res) {
  console.log("$$$$$$$$$$$$$$$$$$$$")
  ShopGrocery.find().exists('deviceId').exec(function(err, shopGrocery) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(shopGrocery);
    }
  });
};

/**
 * Shop grocery authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	//if (req.shopGrocery.user.id !== req.user.id) {
	if ('gehlotchirag@gmail.com' !== req.user.email) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
