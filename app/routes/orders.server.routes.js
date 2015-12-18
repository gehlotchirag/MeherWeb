'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var orders = require('../../app/controllers/orders.server.controller');

	// Orders Routes
	app.route('/orders')
		.get(orders.list)
		.post(orders.create);

  app.route('/orders/shop/:shopId')
      .get(orders.orderByShop);

  app.route('/orders/user/:mobileNumber')
      .get(orders.orderByUserMobile);

  app.route('/orders/:orderId/:orderStatus')
      .put(orders.orderUpdateStatus)

  app.route('/orders/:orderId')
		.get(orders.read)
		.put(orders.update)
		.delete(orders.delete);

	// Finish by binding the Order middleware
	app.param('orderId', orders.orderByID);
};
