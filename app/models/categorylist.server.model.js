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
  loc: { 'type':
  {
    type: String,
    enum: "Point",
    default: "Point"
  },
    coordinates: {
      type: [Number]
    }
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

CategorylistSchema.index({loc: '2dsphere'});
mongoose.model('Categorylist', CategorylistSchema);
