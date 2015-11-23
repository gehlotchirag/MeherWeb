'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Shop grocery Schema
 */
var ShopGrocerySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Shop grocery name',
		trim: true
	},
  phone: {
    type: String,
    default: '',
    required: 'Please fill Shop grocery Phone Numbers',
    trim: true
  },
  address: {
    type: String,
    default: '',
    unique: true,
    required: 'Please fill Shop grocery address',
    trim: true
  },

  loc: { 'type': {type: String, enum: "Point", default: "Point"}, coordinates: { type: [Number],   default: [0,0]} },

  category: {
    type: String,
    default: 'Grocery',
    required: 'Please fill Shop grocery category',
    trim: true
  },
  city: {
    type: String,
    default: '',
    required: 'Please fill Shop grocery city',
    trim: true
  },
  mobile: {
    type: String,
    default: '',
    trim: true
  },
	created: {
		type: Date,
		default: Date.now
	},

  appDownloaded: {
    type : Boolean
  },
  deliveryDistance:{
    type: String,
    default: "1"
  },
  deliveryTime:{
    type: String
  },
  startTime:{
    type: String,
    default: "9"
  },
  closeTime:{
    type: String,
    default: "10"
  },
  ourExperience:{
    type: String
  },
  OffDay:{
    type: String
  },
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});
ShopGrocerySchema.index({loc: '2dsphere'});
mongoose.model('ShopGrocery', ShopGrocerySchema);
