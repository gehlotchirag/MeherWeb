'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Wmachinedescription Schema
 */
var WmachinedescriptionSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Wmachinedescription name',
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

mongoose.model('Wmachinedescription', WmachinedescriptionSchema);
