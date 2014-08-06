/*
 * Copyright(c) 2014 Peter Wilmot
 * MIT Licensed
 */
 
// USER FUNCTIONS
//  ===========================================================================

var User     	= require('../models/user');

// create a User
// accessed at POST -d {user} /taxiservice/user
var postUser = function postUser(req, res) {
	// create a new instance of the User model
	var user = new User();
	user.name = req.body.name;
	user.phone = req.body.phone;
	user.loc = req.body.loc;

	user.save(function(err) {
		if (err) {
			console.log(err);
			return res.send(err);
		}
		return res.send(user);
	});
};

// get all the Users 
// accessed at GET /taxiservice/driver
var getAllUsers = function getAllUsers(req, res) {
	User.find(function(err, users) {
		if (err) {
			console.log(err);
			return res.send(err);
		}
		return res.send(users);
	});
};

// get the User with that id 
//accessed at GET /taxiservice/user/:_id
var getUserById = function getUserById(req, res) {
	User.findById(req.params._id, function(err, user) {
		if (err) {
			console.log(err);
			return res.send(err);
		}
		return res.send(user);
	});
};

// update the user with this id 
// accessed at PUT -d {user} /taxiservice/user/:id
var updateUser = function updateUser(req, res) {
	User.findById(req.params._id, function(err, user) {

		if (err) {
			console.log(err);
			return res.send(err);
		}

		user.name = req.body.name;
		user.phone = req.body.phone;
		user.loc = req.body.loc;

		user.save(function(err) {
			if (err) {
				console.log(err);
				return res.send(err);
			}
			return res.send({ msg: 'success' });
		});

	});
};

// delete the user with this id 
// accessed at DELETE /taxiservice/user/:id
var deleteUser = function deleteUser(req, res) {
	User.remove({
		_id: req.params._id
	}, function(err, user) {
		if (err) {
			console.log(err);
			return res.send(err);
		}

		return res.send({ msg: 'success' });
	});
};

exports.postUser = postUser;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;