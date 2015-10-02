'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Categorylist Schema
 */
var CategorylistSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Categorylist name',
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

mongoose.model('Categorylist', CategorylistSchema);