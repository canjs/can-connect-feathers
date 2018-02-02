@module {Object} can-connect-feathers
@parent can-data-modeling
@collection can-ecosystem
@group can-connect-feathers.behaviors behaviors
@description Integrate can-connect with the FeathersJS Client
@package ../package.json

@type {Object}

`can-connect-feathers` is a set of behaviors for integrating [can-connect] with [Feathers Client](https://docs.feathersjs.com/clients/feathers.html).

 - The [can-connect-feathers/service/service service] behavior connects to a Feathers service.
 - The [can-connect-feathers/session/session session] behavior connects to the [feathers-authentication-client](https://docs.feathersjs.com/authentication/client.html) methods on a Feathers Client instance.

@body

Both of the included behaviors require a Feathers Client instance.  Here is a basic setup: 

```js
// models/feathers.js
var feathers = require('feathers/client');
var socketio = require('feathers-socketio/client');
var io = require('socket.io-client/dist/socket.io');
var hooks = require('feathers-hooks');
var auth = require('feathers-authentication-client');
var socket = io('');

var feathersClient = feathers()
  .configure(hooks())
  .configure(socketio(socket))
  .configure(auth());

module.exports = feathersClient;
```

> Pro tip: If you are planning on using Done-SSR, exchange the `socket.io-client/dist/socket.io` module for `steal-socket.io` in the above example.

you can also define the client async as a Promise here is a little conditional loading example using StealJS

```js
// models/feathers-async.js
/* global window */
import loader from '@loader'; // a Global created when loaded with SystemJS or Steal

let clientUrl;

if (window && window.fetch) {
  clientUrl = '~/models/feathers/v3/feathers-client.socketio.js'; // => Same content as models/feathers.js
} else {
  clientUrl = '~/models/feathers/v3/feathers-client.rest.js'; // => Feathers Client Configured with rest Provider
} 

export const feathersClient = loader.import(clientUrl).then((module)=>{ return module.feathersClient; }, err=>{
  new Error('Feathers-client Error '+ clientUrl,err);
}); 


export default feathersClient;
```
