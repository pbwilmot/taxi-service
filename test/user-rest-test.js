/*

user {
  _id
  name :
  phone :
  loc{lat, long}
}

POST -d {user} /taxiservice/user
GET(all) /taxiservice/user
GET /taxiservice/user/{_id}
PUT -d {user} /taxiservice/user/{_id}
DELETE /taxiservice/user/{_id}

*/
var superagent = require('superagent')
var expect = require('expect.js')

suite('Driver Tests', function(){
	// TODO(pwilmot) replace these with config variables
var port = 8080
var root = "http://localhost:" + port + "/taxiservice/"
var user_sufix = "/user"

	var id

	// Insert a first object : POST -d {user} /taxiservice/user
  	test('POST user object', function(done){
    	superagent.post(root + user_sufix)
      	.send({ name: 'Peter', 
      			phone: '(111)111-1111)',
      			loc: [ 4.881217, 52.36518 ],
      	})
      	.end(function(e,res){
        	// console.log(res.body)
        	expect(e).to.eql(null)
        	// Expect that the _id field has been set
        	expect(res.body._id.length).to.eql(24)
        	id = res.body._id
        	done()
      	})
  	})

	// GET /taxiservice/user/{_id}
  	test('GET user object', function(done){
    	superagent.get(root + user_sufix + '/' + id)
     	.end(function(e, res){
        // console.log(res.body)
	        expect(e).to.eql(null)
	        expect(typeof res.body).to.eql('object')
	        expect(res.body.name).to.eql('Peter')
	        expect(res.body.phone).to.eql('(111)111-1111)')
	        expect(res.body._id.length).to.eql(24)
	        expect(res.body._id).to.eql(id)
	        done()
      	})
  	})

	// GET(all) /taxiservice/user
	test('GET all user objects', function(done){
    	superagent.get(root + user_sufix)
      	.end(function(e, res){
	        // console.log(res.body)
	        expect(e).to.eql(null)
	        expect(res.body.length).to.be.greaterThan(0)
	        expect(res.body.map(function (item){return item._id})).to.contain(id)
        	done()
    	})
  	})

	// PUT -d {user} /taxiservice/user/{_id}
	test('updates an object', function(done){
    	superagent.put(root + user_sufix + '/' + id)
      	// The diver's location moves and he goes off duty
      	.send({ name: 'Peter', 
      			phone: '(111)111-1111)',
      			active: false,
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
	// GET /taxiservice/user/{_id}
  	test('checks an updated object', function(done){
    	superagent.get(root + user_sufix + '/' + id)
      	.end(function(e, res){
	        // console.log(res.body)
	        expect(e).to.eql(null)
	        expect(typeof res.body).to.eql('object')
	        expect(res.body._id.length).to.eql(24)
	        expect(res.body._id).to.eql(id)
	        expect(res.body.name).to.eql('Peter')
	        expect(res.body.phone).to.eql('(111)111-1111)')
	        expect(res.body.loc).to.eql([ 37.77493, -122.419416 ])
	        done()
      	})
  	})

	// DELETE /taxiservice/user/{_id}
	test('removes an object', function(done){
    	superagent.del(root + user_sufix + '/' + id)
      	.end(function(e, res){
	        // console.log(res.body)
	        expect(e).to.eql(null)
	        expect(typeof res.body).to.eql('object')
	        expect(res.body.msg).to.eql('success')
	        done()
      	})
  	})

  	// TODO(pwilmot) confirm that the get request now returns null

})
