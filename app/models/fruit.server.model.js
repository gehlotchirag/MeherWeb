'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Fruit Schema
 */
var FruitSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Fruit name',
		trim: true,
    unique: true
  },
  category: {
    type: String,
    default :"fruits"
  },
  price: {
    type: Number,
    default: '',
    required: 'Please fill Fruit name',
    trim: true
  },
  quantity: {
    type: Number,
    default: 1,
    required: 'Please fill Fruit name',
    trim: true
  },
  ImgFileName: {
    type: String,
    default: '',
    required: 'Please fill Fruit name',
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

mongoose.model('Fruit', FruitSchema);
