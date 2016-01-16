'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Offer = mongoose.model('Offer'),
	_ = require('lodash');

/**
 * Create a Offer
 */
exports.create = function(req, res) {

  console.log(req.body)
	var offer = new Offer(req.body);

  //offer.user = req.user;
  console.log("---"+offer)

	offer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(offer);
		}
	});
};



exports.offerByType = function(req,res){
console.log()
  if(!req.params.page)
  {
    var page = 1;
  }else{
    var page = req.params.page;
  }
  var per_page = 12;
  Offer.find({'category':req.params.category}).sort( { name: 1 } ).skip((page-1)*per_page).limit(per_page).exec(function(err, offers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(offers);
    }
  });
}

exports.createAll = function(req, res, next) {
  Offer.collection.remove(function (err, removedCount) {
    //your next actions
    if (!err) {
      var importShops = (req.body);
      var bulk = Offer.collection.initializeUnorderedBulkOp();
      importShops.forEach(function (shop) {
        if (shop)
          bulk.insert(shop);
      });
      bulk.execute(function (err, result) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(result);
        }
      });
    }
  });
}



/**
 * Show the current Offer
 */
exports.read = function(req, res) {
	res.jsonp(req.offer);
};

/**
 * Update a Offer
 */
exports.update = function(req, res) {
	var offer = req.offer ;

	offer = _.extend(offer , req.body);

	offer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(offer);
		}
	});
};

/**
 * Delete an Offer
 */
exports.delete = function(req, res) {
	var offer = req.offer ;

	offer.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(offer);
		}
	});
};

/**
 * List of Offers
 */
exports.list = function(req, res) { 
	Offer.find().sort('-created').populate('user', 'displayName').exec(function(err, offers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(offers);
		}
	});
};

/**
 * Offer middleware
 */
exports.offerByID = function(req, res, next, id) { 
	Offer.findById(id).populate('user', 'displayName').exec(function(err, offer) {
		if (err) return next(err);
		if (! offer) return next(new Error('Failed to load Offer ' + id));
		req.offer = offer ;
		next();
	});
};

/**
 * Offer authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.offer.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
