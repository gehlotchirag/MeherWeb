'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Consumer Schema
 */
var ConsumerSchema = new Schema({
	mobile: {
		type: String,
		default: '',
		required: 'Please fill mobile',
		trim: true,
    unique: true
	},
  deviceId: {
    type : String
  },
  referedBy: {
    type : String
  },
  addLine1: {
    type : String
  },
  addLine2: {
    type : String
  },

  loc: { 'type': {type: String, enum: "Point", default: "Point"}, coordinates: { type: [Number],   default: [0,0]} },

  created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Consumer', ConsumerSchema);
