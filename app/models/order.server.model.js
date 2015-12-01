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
		type: Object,
    required: true
  },
  order: {
    type: Object,
    required: true
  },
	orderStatus:{
	type: String,
	},
  customer: {
    type: Object,
    required: true
  },
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Order', OrderSchema);
