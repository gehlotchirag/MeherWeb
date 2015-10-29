'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Order Schema
 */
var OrderSchema = new Schema({
	store: {
		type: Object
	},
  order: {
    type: Object
  },
  customer: {
    type: Object
  },
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Order', OrderSchema);
