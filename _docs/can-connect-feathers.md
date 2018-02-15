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
import feathers from "feathers/client";

import socketio from "feathers-socketio/client";
import io from "socket.io-client/dist/socket.io";
import hooks from "feathers-hooks";
import auth from "feathers-authentication-client";
const socket = io( "" );

const feathersClient = feathers()
	.configure( hooks() )
	.configure( socketio( socket ) )
	.configure( auth() );

export default feathersClient;
```

> Pro tip: If you are planning on using Done-SSR, exchange the `socket.io-client/dist/socket.io` module for `steal-socket.io` in the above example.