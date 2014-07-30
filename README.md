A taxi service REST API Example with NodeJS, Express 4, and Mongoose/MongoDB

Brief instructions:

```
$ git clone git@github.com:pbwilmot/taxi-service.git
$ npm install
$ node express.js
```

In a new terminal window:

```
$ make test
```

Entities: 

```
driver: { _id, active, loc { lat, long } }
user: { _id, name, phone, loc: { lat, long } }
```

Endpoints: 
```
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
```

TODO:
```
GET /taxiservice/driver/closest/{loc}
```
