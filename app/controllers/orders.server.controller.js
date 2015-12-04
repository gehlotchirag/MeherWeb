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
        var pushString = "You have Recieved 1 order from MEHER "+order.store;
        var smsString = "You have Recieved 1 order from MEHER" + "\n";

        order.order.orderitem.forEach( function (value) {
          if (value.quantity) {
            smsString = smsString + value.quantity;
            if (value.unit)
              smsString = smsString + value.unit + " " + value.name + "\n";
            else
              smsString = smsString + " " + value.name + "\n";
          }
          else
            smsString = smsString + '-' + value.name + "\n";
        });
        smsString = smsString + "Phone: " + order.customer.mobile + "\n";
        smsString = smsString + "Address:" + order.customer.addLine1 + "\n" + order.customer.addLine2;
        console.log(smsString);

        var pushMessage = {
          "users": [order.customer.deviceId],
          "android": {"collapseKey": "optional", "data": {"message": pushString}},
          "ios": {"badge": 0, "alert": pushString, "sound": "soundName"}
        };

        request({
          url: 'http://api.smscountry.com/SMSCwebservice_bulk.aspx?',
          method: "POST",
          qs: {
            User:"mehertech",
            passwd:"developer007",
            mobilenumber: "9820272106",
            message: smsString,
            sid:"MEHERA",
            mtype:"N",
            DR:"Y"
          }
        }, function _callback(err, response, SMSbody) {
          console.log(SMSbody);
          request({
            url: "http://getmeher.com:8000/send",
            method: "POST",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify(pushMessage)
          }, function _callback(err, response, Pushbody) {
            var msg = SMSbody + Pushbody
            res.jsonp({message : msg });
          });
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
      if (orderData.customer) {
        var allAvailable;
        var pushString;
        var smsString;

        if (orserStatus == 'accepted') {
          pushString = "Your order is " + orserStatus + " by " + orderData.store.name ;
          smsString = "Your order is acepted by " + orderData.store.name+ "\n" + "Thanks for using MEHER";
        }
        else if(orserStatus == 'rejected') {
          pushString = "Your order is declined by " + orderData.store.name + ". Request you to order from another store.";
          smsString = "Your order is declined by " + orderData.store.name + ". Request you to order from another store."+ "\n";
        }
        else {
          pushString = "Your order is sent out for delivery by" + orderData.store.name;
          smsString = "Your order is sent out for delivery by" + orderData.store.name+ "\n" + "Thanks for using MEHER";
        }

        if (orserStatus == 'accepted') {
          var tempSmsString ="";
          orderData.order.orderitem.forEach(function (value) {
            if (!value.available) {
              allAvailable = false;
              if (value.quantity) {
                tempSmsString = tempSmsString + value.quantity;
                if (value.unit)
                  tempSmsString = tempSmsString + value.unit + " " + value.name + "\n";
                else
                  tempSmsString = tempSmsString + " " + value.name + "\n";
              }
              else
                tempSmsString = tempSmsString + '-' + value.name + "\n";
            }
          });
          if (allAvailable ==false) {
            smsString = smsString + "\n" + "However below mentioned products are not available with your store" +"\n";
            smsString = smsString + tempSmsString + "Request you to order these items from another store using Meher App";
          }
        }
        console.log("*****")
        console.log(smsString);
        console.log("######")
        //smsString = encodeURIComponent(smsString);
        console.log(smsString);


        var pushMessage = {
          "users": [orderData.customer.deviceId],
          "android": {"collapseKey": "optional", "data": {"message": pushString}},
          "ios": {"badge": 0, "alert": pushString, "sound": "soundName"}
        };

        request({
          url: 'http://api.smscountry.com/SMSCwebservice_bulk.aspx?',
          method: "POST",
          qs: {
            User:"mehertech",
            passwd:"developer007",
            mobilenumber: "9820272106",
            message: smsString,
            sid:"MEHERA",
            mtype:"N",
            DR:"Y"
          }
        }, function _callback(err, response, SMSbody) {
          console.log(SMSbody);
          request({
            url: "http://getmeher.com:8000/send",
            method: "POST",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify(pushMessage)
          }, function _callback(err, response, Pushbody) {
            var msg = SMSbody + Pushbody
            res.jsonp({message : msg });
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
