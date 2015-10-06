'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Refrigerator Schema
 */
var RefrigeratorSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Refrigerator name',
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
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Refrigerator', RefrigeratorSchema);
