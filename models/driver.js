/*
driver {
  _id
  active: 
  loc {lat, long} :
}
*/
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DriverSchema   = new Schema({
	active: Boolean,
	// *NOTE* Coordinate-axis order is longitude, latitude
	loc: {type: [], index: '2dsphere' }
});

module.exports = mongoose.model('Driver', DriverSchema);