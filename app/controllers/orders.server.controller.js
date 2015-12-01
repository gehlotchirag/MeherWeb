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
  //order.user = req.user;

  order.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //res.jsonp(order);
      if (order.store) {
        var cartMsg = "You have Recieved 1 order from MEHER" + "\n";

        orderData.order.orderitem.forEach( function (value) {
          if (value.quantity) {
            cartMsg = cartMsg + value.quantity;
            if (value.unit)
              cartMsg = cartMsg + value.unit + " " + value.name + "\n";
            else
              cartMsg = cartMsg + " " + value.name + "\n";
          }
          else
            cartMsg = cartMsg + '-' + value.name + "\n";
        });
        cartMsg = cartMsg + "Phone: " + orderData.customer.mobile + "\n";
        cartMsg = cartMsg + "Address:" + orderData.customer.addLine1 + "\n" + orderData.customer.addLine2;

        var pushMessage = {
          "users": [order.customer.deviceId],
          "android": {"collapseKey": "optional", "data": {"message": msgString}},
          "ios": {"badge": 0, "alert": msgString, "sound": "soundName"}
        };
        request({
          url: "http://getmeher.com:8000/send",
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify(pushMessage)
        }, function _callback(err, response, body) {

          res.jsonp(order);

        });
      }
      else{
        res.jsonp({message: 'Push not sent to customer'});
      }
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
  var order = req.order ;
  order = _.extend(order , req.body);

  var id = req.params.orderId;
  var orserStatus= req.params.orderStatus;

    Order.findByIdAndUpdate(id,{ order:req.body.order, orderStatus: orserStatus }).exec(function(err, orderData) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log(orderData);
      if (orderData.customer) {
        var cartMsg = "You have Recieved 1 order from MEHER" + "\n";

        orderData.order.orderitem.forEach( function (value) {
          if (value.quantity) {
            cartMsg = cartMsg + value.quantity;
            if (value.unit)
              cartMsg = cartMsg + value.unit + " " + value.name + "\n";
            else
              cartMsg = cartMsg + " " + value.name + "\n";
          }
          else
            cartMsg = cartMsg + '-' + value.name + "\n";
        });
        cartMsg = cartMsg + "Phone: " + orderData.customer.mobile + "\n";
        cartMsg = cartMsg + "Address:" + orderData.customer.addLine1 + "\n" + orderData.customer.addLine2;
        cartMsg = encodeURIComponent(cartMsg);

        console.log("######")
        console.log(cartMsg);


        var msgString;
        if (orserStatus == 'accepted')
         msgString = "Your order is "+orserStatus+" by " + orderData.store.name;
        else if(orserStatus == 'rejected')
         msgString = "Your order is "+orserStatus+" by " + orderData.store.name +". Request you to order from another store";
        else
         msgString = "Your order is sent out for delivery by"+ orderData.store.name;

        var pushMessage = {
          "users": [orderData.customer.deviceId],
          "android": {"collapseKey": "optional", "data": {"message": msgString}},
          "ios": {"badge": 0, "alert": msgString, "sound": "soundName"}
        };

        request({
          url: 'http://api.smscountry.com/SMSCwebservice_bulk.aspx?',
          method: "POST",
          params: {
            User:"mehertech",
            passwd:"developer007",
            mobilenumber: "9820272106",
            message: cartMsg,
            sid:"mehera",
            mtype:"N",
            DR:"Y"
          }
        }, function _callback(err, response, body) {
          res.jsonp(orderData);
          request({
            url: "http://getmeher.com:8000/send",
            method: "POST",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify(pushMessage)
          }, function _callback(err, response, body) {
            res.jsonp(orderData);
          });
        });


      }
      else{
        res.jsonp({message: 'Push not sent to customer'});
      }


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
