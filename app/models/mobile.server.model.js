'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Mobile Schema
 */
var MobileSchema = new Schema({
	name: {
		type: String,
		default: '',
    unique: true,
		required: 'Please fill Mobile name',
		trim: true
	},
  link: {
    type: String,
    default: '',
    required: 'Please fill Mobiledescription link',
    trim: true
  },
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Mobile', MobileSchema);
