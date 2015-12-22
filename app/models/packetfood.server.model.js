'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Packetfood Schema
 */
var PacketfoodSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Packetfood name',
		trim: true
	},
  category: {
    type: String,
    default :"packetfoods"
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

mongoose.model('Packetfood', PacketfoodSchema);
