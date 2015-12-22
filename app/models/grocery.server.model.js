'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Grocery Schema
 */
var GrocerySchema = new Schema({
	name: {
		type: String,
		default: '',
    unique: true,
		required: 'Please fill Grocery name',
		trim: true
	},
  category: {
    type: String,
    default :"groceries"
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

mongoose.model('Grocery', GrocerySchema);
