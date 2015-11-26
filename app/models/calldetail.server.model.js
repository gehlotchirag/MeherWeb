'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Calldetail Schema
 */
var CalldetailSchema = new Schema({
  store: {
    type: Object
  },
  notes:{
    type: String
  },
  url:{
    type: String
  },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Calldetail', CalldetailSchema);
