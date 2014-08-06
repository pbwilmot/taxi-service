/*
 * Copyright(c) 2014 Peter Wilmot
 * MIT Licensed
 */

// *NOTE* Coordinate-axis order is longitude, latitude
var SAN_FRANCISCO_COORDS = [[-122.419416, 37.77493], [-122.424565, 37.776727],
[-122.430595, 37.779475], [-122.437526, 37.781646]];

var FOREIGN_COORDS = [[4.888317, 52.3711787]];  // Amsterdam


var superagent = require('superagent');
var expect = require('expect.js');
var driverSufix = '/driver';


suite('Proximity Tests', function(){
	// TODO(pwilmot) replace these with config variables
  var port = 9080;
  var root = 'http://localhost:' + port + '/taxiservice/';

  var ids = [];           // Ids of all enties for garbage collection

  var proximityIds = [];  // Ids of entities that should be nearby
  var foreignIds = [];    // Ids of entities that shouldn't be nearby
  var inactiveIds = [];   // Ids of inactive entities

  var returnedIds;        // Variable to hold ids returned by the server

	// Insert  Drivers
  test('POST driver objects', function(done){

    var i;
    var active;
    // Create an post drivers at all of the San Francisco locations
    // except for the first location because that is where the user will be
    for (i = 1; i < SAN_FRANCISCO_COORDS.length; i++) {
      // Only make half of the drivers active
      active = i % 2 === 0 ? true : false;
      postDriver(active, SAN_FRANCISCO_COORDS[i], true);
    }

    for (i = 0; i < FOREIGN_COORDS.length; i++) {
      active = true;
      postDriver(active, FOREIGN_COORDS[i], false);
    }

    done();
  });

  // Get closest Drivers
  test('Get nearby drivers', function(done) {
    var userCoord = SAN_FRANCISCO_COORDS[0];

    superagent.get(root +
     '?loc=' + userCoord[0] + '&loc=' + userCoord[1])
    .end(function(e, res) {
      // console.log(res.body)

      expect(e).to.eql(null);
      expect(res.body.length).to.be.greaterThan(0);
      // Loop over all of the returned values 
      // make sure they aren't the foreign coord 
      // and that all of the local coods are present

      returnedIds = res.body.map(function (item){return item._id;});
      
      done();

    });
  }); 

  test('Validate local drivers', function(done) {
    for (var i = 0; i < proximityIds.length; i++) {
      expect(returnedIds).to.contain(proximityIds[i]);
    }
    done();
  });
   
  test('Validate foreign drivers', function(done) {
    for (var i = 0; i < foreignIds.length; i++) {
      expect(returnedIds).to.not.contain(foreignIds[i]);
    }
    done();
  }); 

  test('Validate inactive drivers', function(done) {
    for (var i = 0; i < inactiveIds.length; i++) {
      expect(returnedIds).to.not.contain(inactiveIds[i]);
    }
    done();
  });

  // Clean up state
  test('removes an object', function(done){
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
    
      superagent.del(root + driverSufix + '/' + id)
      .end(validate);
    }
    done();

    var validate = function validate(e, res) {
        // console.log(res.body)
        expect(e).to.eql(null);
        expect(typeof res.body).to.eql('object');
        expect(res.body.msg).to.eql('success');
    };
  });
  

  // TODO(pwilmot) test for when active = false

function postDriver(isActive, longlat, local) {
  superagent.post(root + driverSufix)
    .send({ active: isActive, loc: longlat})
    .end(function(e,res){
      // console.log(res.body)
      expect(e).to.eql(null); // Make sure there arent any errors
      expect(res.body._id.length).to.eql(24); // check for valid _id
      var id = res.body._id;
      ids.push(id); // Save the Id's for garbage collecton
      if (!isActive) {
        inactiveIds.push(id); // any inactive
      } else {
        if (local) {
          proximityIds.push(id); // local and active
        } else {
          foreignIds.push(id);  // foreign and active
        }
      }
    });
}

});





