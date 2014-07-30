/**
A taxi service REST API

Entities: {
	driver: { _id, active, loc { lat, long } }
	user: { _id, name, phone, loc{ lat, long } }
}

Endpoints: {
	Driver: {
		POST -d {driver} /taxiservice/driver
		GET(all) /taxiservice/driver
		GET /taxiservice/driver/:_id
		PUT -d {driver} /taxiservice/driver/:_id
		DELETE /taxiservice/driver/:_id	
	}
	User: {
		POST -d {user} /taxiservice/user
		GET(all) /taxiservice/user
		GET /taxiservice/user/:_id
		PUT -d {user} /taxiservice/user/:_id
		DELETE /taxiservice/user/:_id	
	}
	Service: {
		GET /taxiservice/closest/:loc
	}
}


*/
// CONSTANTS
var ROOT 		= '/taxiservice';
var DRIVER_ROOT = '/driver';
var USER_ROOT 	= '/user';
var ID_ROOT 	= '/:_id';
var DEFAULT_PROXIMITY_QUERY_DISTANCE = 2000;
var DEFAULT_PROXIMITY_QUERY_LIMIT = 10;
// BASE SETUP
// ============================================================================

// call the packages we need
var express    	= require('express');
var bodyParser 	= require('body-parser');
var app        	= express();

// configure app
app.use(bodyParser());

var port     	= process.env.PORT || 8080; // set our port
var db 		 	= 'taxiservice';

var mongoose   	= require('mongoose');
mongoose.connect('mongodb://@localhost:27017/' + db); // connect to our database

// APIs
var driverAPI   = require('./api/driver');
var userAPI		= require('./api/user');

// ROUTES FOR OUR API
// ============================================================================

// create our router
var router = express.Router();

// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.use(function(req, res, next) {
	console.log('%s %s', req.method, req.url);
	next();
});

// on routes /taxiservice
// ----------------------------------------------------
router.route('')
	.get(function(req, res) { 
		if (req.query.loc == null || req.query.loc.length !== 2) {
			// *NOTE* Coordinate-axis order is longitude, latitude
			res.send('invalid geoPoint.  make sure loc is of the form [ long, lat ]');
		}

		var maxDistance = req.query.maxDistance != null ? 
				req.query.maxDistance 
					: DEFAULT_PROXIMITY_QUERY_DISTANCE;
		var limit = req.query.limit != null ? 
				req.query.limit 
					: DEFAULT_PROXIMITY_QUERY_LIMIT;
		var lng = parseFloat(req.query.loc[0]);
		var lat = parseFloat(req.query.loc[1]);

		Driver.find({ 
			loc : { 
				$near: { // Get drivers that are near the given coordinates
					$geometry : 
						{ type : 'Point' , coordinates : [ lng, lat ] },
					$maxDistance: maxDistance
				}		
			},
			  active : true	// Only return drivers that are active	
		}).limit(limit) // limit the number of results
		.exec(function(err, drivers) {
				if (err) {
					console.log(err);
					res.send(err);
				}
				res.send(drivers);
		});
	});

// on routes /taxiservice/driver
// ----------------------------------------------------
router.route(DRIVER_ROOT)
	
	.post(driverAPI.postDriver)
	
	.get(driverAPI.getAllDrivers);

// on routes /taxiservice/driver/:_id	
// ----------------------------------------------------
router.route(DRIVER_ROOT + ID_ROOT)

	.get(driverAPI.getDriverById)

	.put(driverAPI.updateDriver)

	.delete(driverAPI.deleteDriver);
	
// on routes /taxiservice/user
// ----------------------------------------------------
router.route(USER_ROOT)

	
	.post(userAPI.postUser)

	
	.get(userAPI.getAllUsers);

// on routes /taxiservice/user/:_id	
// ----------------------------------------------------
router.route(USER_ROOT + ID_ROOT)

	.get(userAPI.getUserById)

	.put(userAPI.updateUser)

	.delete(userAPI.deleteUser);


// REGISTER OUR ROUTES -------------------------------
app.use(ROOT, router);

// START THE SERVER
// ============================================================================
app.listen(port);
console.log('Starting taxiservice on port ' + port);
