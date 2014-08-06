/*
 * Copyright(c) 2014 Peter Wilmot
 * MIT Licensed
 */
 
// DRIVER FUNCTIONS
//  ===========================================================================

var Driver     	= require('../models/driver');

// create a Driver 
// accessed at POST -d {driver} /taxiservice/driver
var postDriver = function postDriver(req, res) {
	// create a new instance of the Driver model
	var driver = new Driver();
	driver.active = req.body.active;
	driver.loc = req.body.loc;		

	driver.save(function(err) {
		if (err) {
			console.log(err);
			return res.send(err);
		}
		return res.send(driver);
	});
};

// get all the Drivers 
// accessed at GET /taxiservice/driver
var getAllDrivers = function getAllDrivers(req, res) {
	Driver.find(function(err, drivers) {
		if (err) {
			console.log(err);
			return res.send(err);
		}
		return res.send(drivers);
	});
};

// get the Driver with that id 
//accessed at GET /taxiservice/driver/:_id
var getDriverById = function getDriverById(req, res) {
	Driver.findById(req.params._id, function(err, driver) {
		if (err) {
			console.log(err);
			return res.send(err);
		}
		return res.send(driver);
	});
};

// update the driver with this id 
// accessed at PUT -d {driver} /taxiservice/driver/:id
var updateDriver = function updateDriver(req, res) {
	Driver.findById(req.params._id, function(err, driver) {

		if (err) {
			console.log(err);
			return res.send(err);
		}

		driver.active = req.body.active;
		driver.loc = req.body.loc;
		driver.save(function(err) {
			if (err) {
				console.log(err);
				return res.send(err);
			}
			return res.send({ msg: 'success' });
		});

	});
};

// delete the driver with this id 
// accessed at DELETE /taxiservice/driver/:id
var deleteDriver = function deleteDriver(req, res) {
	Driver.remove({
		_id: req.params._id
	}, function(err, driver) {
		if (err) {
			console.log(err);
			return res.send(err);
		}

		return res.send({ msg: 'success' });
	});
};

exports.postDriver = postDriver;
exports.getAllDrivers = getAllDrivers;
exports.getDriverById = getDriverById;
exports.updateDriver = updateDriver;
exports.deleteDriver = deleteDriver;