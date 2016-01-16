'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ShopElectronic = mongoose.model('ShopElectronic'),
	_ = require('lodash');

/**
 * Create a Shop electronic
 */
exports.create = function(req, res) {
	var shopElectronic = new ShopElectronic(req.body);
	shopElectronic.user = req.user;

	shopElectronic.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shopElectronic);
		}
	});
};

exports.createAll = function(req, res, next) {
  var importShops = (req.body);
  var bulk = ShopElectronic.collection.initializeUnorderedBulkOp();
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
 * Show the current Shop electronic
 */
exports.read = function(req, res) {
	res.jsonp(req.shopElectronic);
};

/**
 * Update a Shop electronic
 */
exports.update = function(req, res) {
	var shopElectronic = req.shopElectronic ;

	shopElectronic = _.extend(shopElectronic , req.body);

	shopElectronic.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shopElectronic);
		}
	});
};

/**
 * Delete an Shop electronic
 */
exports.delete = function(req, res) {
	var shopElectronic = req.shopElectronic ;

	shopElectronic.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shopElectronic);
		}
	});
};

/**
 * List of Shop electronics
 */
exports.list = function(req, res) { 
	ShopElectronic.find().sort('-created').populate('user', 'displayName').exec(function(err, shopElectronics) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shopElectronics);
		}
	});
};


exports.listOfElectronics = function(req, res) {
  console.log(req.params.listOfElectronicsPage)
  if(!req.params.listOfElectronicsPage)
  {
    var page = 1;
  }else{
    var page = req.params.listOfElectronicsPage;
  }
  var per_page = 80;

  ShopElectronic.find().skip((page-1)*per_page).limit(per_page).sort('-created').exec(function(err, shopFruits) {
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
  if(!req.params.electronicspage)
  {
    var page = 1;
  }else{
    var page = req.params.electronicspage;
  }
  var per_page = 10;

  ShopElectronic.find(
      {
        loc:
        { $near :
        {
          $geometry: { type: "Point",  coordinates: [ req.params.electronicslng, req.params.electronicslat ] },
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
 * Shop electronic middleware
 */
exports.shopElectronicByID = function(req, res, next, id) { 
	ShopElectronic.findById(id).populate('user', 'displayName').exec(function(err, shopElectronic) {
		if (err) return next(err);
		if (! shopElectronic) return next(new Error('Failed to load Shop electronic ' + id));
		req.shopElectronic = shopElectronic ;
		next();
	});
};

exports.shopElectronicByMobile= function(req, res) {
  ShopElectronic.findOneAndUpdate({ mobile: req.params.mobile },{deviceId: req.params.deviceId}).exec(function(err, shopGrocery) {
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
 * Shop electronic authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.shopElectronic.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
