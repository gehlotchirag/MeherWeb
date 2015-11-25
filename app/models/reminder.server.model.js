'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Reminder Schema
 */
var ReminderSchema = new Schema({
  store: {
    type: Object
  },
  notes:{
    type: String
  },
  shopName:{
    type: String
  },
  mobile: {
    type: String,
    default: '',
    trim: true
  },
  address:{
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

mongoose.model('Reminder', ReminderSchema);
