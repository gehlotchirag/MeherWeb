'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Mobiledescription Schema
 */
var MobiledescriptionSchema = new Schema({
	name: {
		type: String,
		default: '',
    unique: true,
		required: 'Please fill Mobiledescription name',
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

mongoose.model('Mobiledescription', MobiledescriptionSchema);
