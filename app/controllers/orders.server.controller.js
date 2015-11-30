'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Order = mongoose.model('Order'),
    _ = require('lodash');
var request = require('request');

/**
 * Create a Order
 */
exports.create = function(req, res) {
  var order = new Order(req.body);
  order.user = req.user;

  order.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(order);
    }
  });
};

/**
 * Show the current Order
 */
exports.read = function(req, res) {
  res.jsonp(req.order);
};

/**
 * Update a Order
 */
exports.update = function(req, res) {
  var order = req.order ;

  order = _.extend(order , req.body);

  order.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(order);
    }
  });
};

/**
 * Delete an Order
 */
exports.delete = function(req, res) {
  var order = req.order ;

  order.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(order);
    }
  });
};

/**
 * List of Orders
 */
exports.list = function(req, res) {
  Order.find().sort('-created').populate('user', 'displayName').exec(function(err, orders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(orders);
    }
  });
};

/**
 * Order middleware
 */
exports.orderByID = function(req, res, next, id) {
  Order.findById(id).populate('user', 'displayName').exec(function(err, order) {
    if (err) return next(err);
    if (! order) return next(new Error('Failed to load Order ' + id));
    req.order = order ;
    next();
  });
};

exports.orderUpdateStatus= function(req, res) {
  var id = req.params.shopId;
  var orserStatus= req.params.orderStatus;
  Order.findByIdAndUpdate(id,{ orderStatus: orserStatus }).exec(function(err, shopOrder) {
  //Order.findByIdAndUpdate({'store._id':req.params.shopId}).exec(function(err, shopOrder) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //res.jsonp(shopOrder);

      var pushMessage = {"users":[shopOrder.customer.deviceId],"android":{"collapseKey":"optional","data":{"message":"Your order is accepted by"+shopOrder.store.name}},"ios":{"badge":0,"alert":"Your message here","sound":"soundName"}};

      //request('http://www.google.com', function (error, response, body) {
      //  if (!error && response.statusCode == 200) {
      //    res.jsonp(body) // Show the HTML for the Google homepage.
      //  }
      //})
      request({
        url: "http://getmeher.com:8000/send",
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(pushMessage)
      }, function _callback(err, response, body) {
        console.log(response);
        console.log(body);
        //res.jsonp({message:"sent"});
        res.jsonp(body);
      });

    }
  });
};

exports.orderByShop= function(req, res) {
  Order.find({'store._id':req.params.shopId}).exec(function(err, shopOrder) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log(shopOrder);
      res.jsonp(shopOrder);
    }
  });
};

/**
 * Order authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.order.user.id !== req.user.id) {
    return res.status(403).send('User is not authorized');
  }
  next();
};
