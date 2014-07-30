/*
 * Copyright(c) 2014 Peter Wilmot
 * MIT Licensed
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DriverSchema   = new Schema({
	active: Boolean,
	// *NOTE* Coordinate-axis order is longitude, latitude
	loc: {type: [], index: '2dsphere' }
});

module.exports = mongoose.model('Driver', DriverSchema);