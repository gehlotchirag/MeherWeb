'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Shop fruit Schema
 */
var ShopFruitSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Shop name',
    trim: true
  },
  phone: {
    type: String,
    default: '',
    required: 'Please fill Shop Phone Numbers',
    trim: true
  },
  address: {
    type: String,
    default: '',
    unique: true,
    required: 'Please fill Shop address',
    trim: true
  },

  loc: { 'type': {type: String, enum: "Point", default: "Point"}, coordinates: { type: [Number],   default: [0,0]} },

  category: {
    type: String,
    default: 'fruits',
    required: 'Please fill Shop category',
    trim: true
  },
  city: {
    type: String,
    default: '',
    required: 'Please fill Shop city',
    trim: true
  },
  mobile: {
    type: String,
    default: '',
    trim: true
  },
  verified:{
    type : Boolean
  },
    deviceId: {
    type : String
  },
  deliveryDistance:{
    type: String,
    default: "0.5"
  },
  deliveryTime:{
    type: String,
    default: "30"
  },
  startTime:{
    type: String,
    default: "9"
  },
  closeTime:{
    type: String,
    default: "10"
  },
  preference:{
    type: Number
  },
  ourExperience:{
    type: String
  },
  OffDay:{
    type: String
  },
  minimumOrderPrice:{
    type: String
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
ShopFruitSchema.index({loc: '2dsphere'});
mongoose.model('ShopFruit', ShopFruitSchema);
