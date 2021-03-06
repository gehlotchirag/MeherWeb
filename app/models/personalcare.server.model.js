'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Personalcare Schema
 */
var PersonalcareSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Personalcare name',
		trim: true
	},
  category: {
    type: String,
    default :"personalcares"
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

mongoose.model('Personalcare', PersonalcareSchema);
