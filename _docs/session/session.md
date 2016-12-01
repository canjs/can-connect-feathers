@module {connect.Behavior} can-connect-feathers/session/session
@parent can-connect-feathers.behaviors
@group can-connect-feathers/session/session.options options
@group can-connect-feathers/session/session.data-methods data methods

@signature `feathersSession(baseConnect)`

Connects [can-connect/DataInterface] methods to the [feathers-authentication-client](https://github.com/feathersjs/feathers-authentication-client) plugin methods for authentication.

```js
connect([
  feathersSession
], {
  feathersClient: feathersClient,
});
``` 

@body

The `feathers-session` behavior uses the [feathers-authentication-client](https://github.com/feathersjs/feathers-authentication-client) helps authenticate with a Feathers server.  Three of the [can-connect/DataInterface DataInterface] methods are used:

 - [can-connect-feathers/session/session.data-methods.createData createData] attempts to authenticate with the Feathers server, which upon success returns a JSON Web Token (JWT).  The JWT contains a payload with information about the current session.
 - [can-connect-feathers/session/session.data-methods.getData] validates the JWT and returns its payload the token hasn't expired.
 - [can-connect-feathers/session/session.data-methods.destroyData] unauthenticates from the server and discards the JWT token on the client.

## Use

Setting up the Feathers Client is a prerequisite for using this behavior.  See the [can-connect-feathers] page for an example of a basic Feathers Client configuration.  With the Feathers client setup, it can be used with the `feathers-session` behavior as demonstrated in the example, below.

```js
// models/session.js
var connect = require('can-connect');
var DefineMap = require('can-define/map/');

var feathersSessionBehavior require('can-connect-feathers/session');
var dataParse require('can-connect/data/parse/');
// var construct require('can-connect/constructor/');
// var constructStore require('can-connect/constructor/store/');
// var constructOnce require('can-connect/constructor/callbacks-once/');
var canMap require('can-connect/can/map/');
var canRef require('can-connect/can/ref/');
var dataCallbacks require('can-connect/data/callbacks/');

// Bring in the feathersClient instance.
var feathersClient = require('./feathers');

var Session = DefineMap.extend('Session', {
  seal: false
}, {
  userId: '*',
  email: 'string',
  password: 'string'
});

connect([
  // Include the feathers session behavior in the behaviors list.
  feathersSession,
  dataParse,
  canMap,
  canRef,
  // construct,
  // constructStore,
  // constructOnce,
  dataCallbacks
], {
  // Pass the feathers client as the `feathersClient` property.
  feathersClient: feathersClient,
  idProp: 'userId',
  Map: Session,
  name: 'session'
});
```