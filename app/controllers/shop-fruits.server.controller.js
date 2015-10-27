'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ShopFruit = mongoose.model('ShopFruit'),
	_ = require('lodash');

/**
 * Create a Shop fruit
 */
exports.create = function(req, res) {
	var shopFruit = new ShopFruit(req.body);
	shopFruit.user = req.user;

	shopFruit.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shopFruit);
		}
	});
};

exports.createAll = function(req, res, next) {
  var importShops = (req.body);
  var bulk = ShopFruit.collection.initializeUnorderedBulkOp();
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
 * Show the current Shop fruit
 */
exports.read = function(req, res) {
	res.jsonp(req.shopFruit);
};

/**
 * Update a Shop fruit
 */
exports.update = function(req, res) {
	var shopFruit = req.shopFruit ;

	shopFruit = _.extend(shopFruit , req.body);

	shopFruit.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shopFruit);
		}
	});
};

/**
 * Delete an Shop fruit
 */
exports.delete = function(req, res) {
	var shopFruit = req.shopFruit ;

	shopFruit.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shopFruit);
		}
	});
};

/**
 * List of Shop fruits
 */
exports.list = function(req, res) { 
	ShopFruit.find().sort('-created').populate('user', 'displayName').exec(function(err, shopFruits) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shopFruits);
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

  ShopFruit.find(
      {
        loc:
        { $near :
        {
          $geometry: { type: "Point",  coordinates: [ req.params.lng, req.params.lat ] },
          $maxDistance: 200000
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
 * Shop fruit middleware
 */
exports.shopFruitByID = function(req, res, next, id) { 
	ShopFruit.findById(id).populate('user', 'displayName').exec(function(err, shopFruit) {
		if (err) return next(err);
		if (! shopFruit) return next(new Error('Failed to load Shop fruit ' + id));
		req.shopFruit = shopFruit ;
		next();
	});
};

exports.shopFruitByMobile= function(req, res) {
  ShopFruit.find({ mobile: req.params.mobile }).exec(function(err, shopGrocery) {
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
 * Shop fruit authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.shopFruit.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
