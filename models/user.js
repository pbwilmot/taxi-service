/*
user {
  _id
  name:
  phone:
  loc{lat, long}
}
*/
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
	name: String,
	phone: String,  // TODO(pwilmot) validate phone #
	// *NOTE* Coordinate-axis order is longitude, latitude
	loc: {type: [], index: '2dsphere' }
});

module.exports = mongoose.model('User', UserSchema);