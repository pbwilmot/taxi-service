/*

driver {
  _id
  active : 
  loc {lat, long} :
}

POST -d {driver} /taxiservice/driver
GET(all) /taxiservice/driver
GET /taxiservice/driver/{_id}
PUT -d {driver} /taxiservice/driver/{_id}
DELETE /taxiservice/driver/{_id}

GET /taxiservice/driver/closest/{loc}

*/
var superagent = require('superagent')
var expect = require('expect.js')

suite('Driver Tests', function(){
	// TODO(pwilmot) replace these with config variables
	const var port = 3000
	const var root = "http://localhost:" + port + "/taxiservice/"
	const var driver_sufix = "/driver"

	var id

	// Insert a first object : POST -d {driver} /taxiservice/driver
  	test('POST driver object', function(done){
    	superagent.post(root + driver_sufix)
      	.send({ active: true,
      			loc: [ 4.881217, 52.36518 ],
      	})
      	.end(function(e,res){
        	// console.log(res.body)
        	expect(e).to.eql(null)
        	expect(res.body.length).to.eql(1)
        	// Expect that the _id field has been set
        	expect(res.body[0]._id.length).to.eql(24)
        	id = res.body[0]._id
        	done()
      	})
  	})

	// GET /taxiservice/driver/{_id}
  	test('GET driver object', function(done){
    	superagent.get(root + driver_sufix + '/' + id)
     	.end(function(e, res){
        // console.log(res.body)
	        expect(e).to.eql(null)
	        expect(typeof res.body).to.eql('object')
	        expect(res.body.active).to.eql(true)
	        expect(res.body._id.length).to.eql(24)
	        expect(res.body._id).to.eql(id)
	        done()
      	})
  	})

	// GET(all) /taxiservice/driver
	test('GET all driver objects', function(done){
    	superagent.get(root + driver_sufix)
      	.end(function(e, res){
	        // console.log(res.body)
	        expect(e).to.eql(null)
	        expect(res.body.length).to.be.greaterThan(0)
	        expect(res.body.map(function (item){return item._id})).to.contain(id)
        	done()
    	})
  	})

	// PUT -d {driver} /taxiservice/driver/{_id}
	test('updates an object', function(done){
    	superagent.put(root + driver_sufix + '/' + id)
      	// The diver's location moves and he goes off duty
      	.send({ active: false,
      			loc: [ 37.77493, -122.419416 ],
      	})
      	.end(function(e, res){
	        // console.log(res.body)
	        expect(e).to.eql(null)
	        expect(typeof res.body).to.eql('object')
	        expect(res.body.msg).to.eql('success')
	        done()
		})
  	})

	// Confirm that the update worked
	// GET /taxiservice/driver/{_id}
  	test('checks an updated object', function(done){
    	superagent.get(root + driver_sufix + '/' + id)
      	.end(function(e, res){
	        // console.log(res.body)
	        expect(e).to.eql(null)
	        expect(typeof res.body).to.eql('object')
	        expect(res.body._id.length).to.eql(24)
	        expect(res.body._id).to.eql(id)
	        expect(res.body.active).to.eql(false)
	        expect(res.body.loc).to.eql([ 37.77493, -122.419416 ])
	        done()
      	})
  	})

	// DELETE /taxiservice/driver/{_id}
	test('removes an object', function(done){
    	superagent.del(root + driver_sufix + '/' + id)
      	.end(function(e, res){
	        // console.log(res.body)
	        expect(e).to.eql(null)
	        expect(typeof res.body).to.eql('object')
	        expect(res.body.msg).to.eql('success')
	        done()
      	})
  	})

  	// TODO(pwilmot) confirm that the get request now returns null

	// GET /taxiservice/driver/closest/{loc}

}