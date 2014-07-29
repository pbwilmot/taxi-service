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
// models
var Driver     	= require('./models/driver');
var User     	= require('./models/user');

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

// on routes /driver
// ----------------------------------------------------
router.route(DRIVER_ROOT)

	
	.post(function(req, res) { postDriver(req, res) })

	
	.get(function(req, res) { getAllDrivers(req, res) });

// on routes /driver/:_id	
// ----------------------------------------------------
router.route(DRIVER_ROOT + ID_ROOT)

	.get(function(req, res) { getDriverById(req, res) })

	.put(function(req, res) { updateDriver(req, res) })

	.delete(function(req, res) { deleteDriver(req, res) });
	
// on routes /user
// ----------------------------------------------------
router.route(USER_ROOT)

	
	.post(function(req, res) { postUser(req, res) })

	
	.get(function(req, res) { getAllUsers(req, res) });

// on routes /user/:_id	
// ----------------------------------------------------
router.route(USER_ROOT + ID_ROOT)

	.get(function(req, res) { getUserById(req, res) })

	.put(function(req, res) { updateUser(req, res) })

	.delete(function(req, res) { deleteUser(req, res) });

// USER FUNCTIONS
//  ===========================================================================
// create a User
// accessed at POST -d {user} /taxiservice/user
function postUser(req, res) {
	// create a new instance of the Driver model
	var user = new User();
	user.name = req.body.name
	user.phone = req.body.phone
	user.loc = req.body.loc;

	user.save(function(err) {
		if (err) {
			res.send(err);
		}
		res.send(user);
	});
}

// get all the Drivers 
// accessed at GET /taxiservice/driver
function getAllUsers(req, res) {
	User.find(function(err, users) {
		if (err) {
			res.send(err);
		}
		res.send(users);
	});
}

// get the User with that id 
//accessed at GET /taxiservice/user/:_id
function getUserById(req, res) {
	User.findById(req.params._id, function(err, user) {
		if (err) {
			res.send(err);
		}
		res.send(user);
	});
}

// update the user with this id 
// accessed at PUT -d {user} /taxiservice/user/:id
function updateUser(req, res) {
	User.findById(req.params._id, function(err, user) {

		if (err) {
			res.send(err);
		}

		user.name = req.body.name
		user.phone = req.body.phone
		user.loc = req.body.loc;

		user.save(function(err) {
			if (err) {
				res.send(err);
			}
			res.send({ msg: 'success' });
		});

	});
}

// delete the user with this id 
// accessed at DELETE /taxiservice/user/:id
function deleteUser(req, res) {
	User.remove({
		_id: req.params._id
	}, function(err, user) {
		if (err) {
			res.send(err);
		}

		res.send({ msg: 'success' });
	});
}

// DRIVER FUNCTIONS
//  ===========================================================================

// create a Driver 
// accessed at POST -d {driver} /taxiservice/driver
function postDriver(req, res) {
	// create a new instance of the Driver model
	var driver = new Driver();
	driver.active = req.body.active;
	driver.loc = req.body.loc;		

	driver.save(function(err) {
		if (err) {
			res.send(err);
		}
		res.send(driver);
	});
}

// get all the Drivers 
// accessed at GET /taxiservice/driver
function getAllDrivers(req, res) {
	Driver.find(function(err, drivers) {
		if (err) {
			res.send(err);
		}
		res.send(drivers);
	});
}

// get the Driver with that id 
//accessed at GET /taxiservice/driver/:_id
function getDriverById(req, res) {
	Driver.findById(req.params._id, function(err, driver) {
		if (err) {
			res.send(err);
		}
		res.send(driver);
	});
}

// update the driver with this id 
// accessed at PUT -d {driver} /taxiservice/driver/:id
function updateDriver(req, res) {
	Driver.findById(req.params._id, function(err, driver) {

		if (err) {
			res.send(err);
		}

		driver.active = req.body.active;
		driver.loc = req.body.loc;
		driver.save(function(err) {
			if (err) {
				res.send(err);
			}
			res.send({ msg: 'success' });
		});

	});
}

// delete the driver with this id 
// accessed at DELETE /taxiservice/driver/:id
function deleteDriver(req, res) {
	Driver.remove({
		_id: req.params._id
	}, function(err, driver) {
		if (err) {
			res.send(err);
		}

		res.send({ msg: 'success' });
	});
}

// ** USER ROUTES **


// REGISTER OUR ROUTES -------------------------------
app.use(ROOT, router);

// START THE SERVER
// ============================================================================
app.listen(port);
console.log('Starting taxiservice on port ' + port);