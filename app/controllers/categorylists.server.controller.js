'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Categorylist = mongoose.model('Categorylist'),
	_ = require('lodash');

/**
 * Create a Categorylist
 */
exports.create = function(req, res) {
	var categorylist = new Categorylist(req.body);
	categorylist.user = req.user;

	categorylist.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(categorylist);
		}
	});
};


exports.createAll = function(req, res, next) {
  Categorylist.collection.remove(function(err, removedCount) {
    //your next actions
    if(!err){
      var importShops = (req.body);
      var bulk = Categorylist.collection.initializeUnorderedBulkOp();
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
    }
  });

};


/**
 * Show the current Categorylist
 */
exports.read = function(req, res) {
	res.jsonp(req.categorylist);
};

/**
 * Update a Categorylist
 */
exports.update = function(req, res) {
	var categorylist = req.categorylist ;

	categorylist = _.extend(categorylist , req.body);

	categorylist.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(categorylist);
		}
	});
};

/**
 * Delete an Categorylist
 */
exports.delete = function(req, res) {
	var categorylist = req.categorylist ;

	categorylist.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(categorylist);
		}
	});
};

/**
 * List of Categorylists
 */
exports.list = function(req, res) { 
	Categorylist.find().exec(function(err, categorylists) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(categorylists);
		}
	});
};
exports.listNear = function(req, res) {
  var TotalData;
  Categorylist.find({"loc":null}).exec(function(err, cat) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      TotalData = cat;
      console.log(TotalData)
      Categorylist.find()
          .and([
            {"loc":{$ne:null}},
            {
              loc:
              { $near :
              {
                $geometry: { type: "Point",  coordinates: [ req.params.lng, req.params.lat ]},
                $maxDistance: 200000
              }
              }
            }
          ])
      .exec(function(err, cityCat) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          //TotalData = TotalData + cityCat;
          TotalData = TotalData.concat(cityCat);
          console.log("&&&&&&&&&")
          console.log(TotalData)
          res.jsonp(TotalData);
        }
      });
    }
  });
};

/**
 * Categorylist middleware
 */
exports.categorylistByID = function(req, res, next, id) { 
	Categorylist.findById(id).populate('user', 'displayName').exec(function(err, categorylist) {
		if (err) return next(err);
		if (! categorylist) return next(new Error('Failed to load Categorylist ' + id));
		req.categorylist = categorylist ;
		next();
	});
};

/**
 * Categorylist authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.categorylist.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
