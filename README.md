A taxi service REST API

Entities: 
****
driver {
  _id
  active: 
  loc {lat, long} :
}

user {
  _id
  name:
  phone:
  loc{lat, long}
}

Endpoints: 
****
POST -d {driver} /taxiservice/driver
GET(all) /taxiservice/driver
GET /taxiservice/driver/{_id}
PUT -d {driver} /taxiservice/driver/{_id}
DELETE /taxiservice/driver/{_id}

POST -d {user} /taxiservice/user
GET(all) /taxiservice/user
GET /taxiservice/user/{_id}
PUT -d {user} /taxiservice/user/{_id}
DELETE /taxiservice/user/{_id}

GET /taxiservice/driver/closest/{loc}
