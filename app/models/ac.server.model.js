'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Ac Schema
 */
var AcSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Ac name',
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

mongoose.model('Ac', AcSchema);
