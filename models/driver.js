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
	loc: []
});

module.exports = mongoose.model('Driver', DriverSchema);