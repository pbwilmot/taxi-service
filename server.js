/*
 * Copyright(c) 2014 Peter Wilmot
 * MIT Licensed
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

// load packages
var express    	= require('express');
var bodyParser 	= require('body-parser');
var morgan  	= require('morgan');
var winston 	= require('winston');

// create app
var app        	= express();

// custom logger to pass express logging to winston
var winstonStream = {
    write: function(str){
    	// remove the newline
        winston.info(str.slice(0, -1));
    }
};

// configure app
app.use(bodyParser());
app.use(morgan('short', {stream:winstonStream}));

// Create a log file based on ts
winston.add(winston.transports.File,
	{ filename: 'logs_' + new Date() / 1000 + '.log' });
// winston.remove(winston.transports.Console);

var port     	= process.env.PORT || 8080; // set our port
var db 		 	= 'taxiservice';

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://@localhost:27017/' + db;
var mongoose   	= require('mongoose');
mongoose.connect(mongoUri); // connect to database

// Models
var Driver   	= require('./models/driver');
var User		= require('./models/user');

// APIs
var driverAPI   = require('./api/driver');
var userAPI		= require('./api/user');

// ROUTES FOR OUR API
// ============================================================================

// create our router
var router = express.Router();

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
				console.log(drivers);
				res.jsonp(drivers);
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
