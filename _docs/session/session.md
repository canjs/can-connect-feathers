@module {connect.Behavior} can-connect-feathers/session/session
@parent can-connect-feathers.behaviors
@group can-connect-feathers/session/session.options options
@group can-connect-feathers/session/session.data-methods data methods

@signature `feathersSession(baseConnect)`

Connects [can-connect/DataInterface] methods to the [feathers-authentication-client](https://github.com/feathersjs/feathers-authentication-client) plugin methods for authentication.

```js
connect( [
	feathersSession,
	realtime
], {
	feathersClient: feathersClient,
	Map: SessionMap
} );
``` 

@body

The `feathers-session` behavior uses the [feathers-authentication-client](https://github.com/feathersjs/feathers-authentication-client) to authenticate with a Feathers server.  Three of the [can-connect/DataInterface DataInterface] methods are used:

 - [can-connect-feathers/session/session.data-methods.createData createData] attempts to authenticate with the Feathers server, which upon success returns a JSON Web Token (JWT).  The JWT contains a payload with information about the current session.  That payload is returned as the session object.
 - [can-connect-feathers/session/session.data-methods.getData] validates a stored JWT and returns its payload if the token hasn't expired.
 - [can-connect-feathers/session/session.data-methods.destroyData] unauthenticates from the server and discards the JWT token on the client.

## Use

Setting up the Feathers Client is a prerequisite for using this behavior.  See the [can-connect-feathers] page for an example of a basic Feathers Client configuration.  With the Feathers client setup, it can be used with the `feathers-session` behavior as demonstrated in the example, below.

```js
// models/session.js
import connect from "can-connect";

import DefineMap from "can-define/map/";
import feathersSessionBehavior from "can-connect-feathers/session";
import dataParse from "can-connect/data/parse/";
import construct from "can-connect/constructor/";
import constructStore from "can-connect/constructor/store/";
import constructCallbacksOnce from "can-connect/constructor/callbacks-once/";
import canMap from "can-connect/can/map/";
import canRef from "can-connect/can/ref/";
import dataCallbacks from "can-connect/data/callbacks/";

// Bring in your user model to setup the relation in your DefineMap.
import User from "./user";

// Bring in the feathersClient instance.
import feathersClient from "./feathers";

export const Session = DefineMap.extend( "Session", {
	seal: false
}, {
	exp: "any",
	userId: "any",
	user: {
		Type: User,

		// Automatically populate the user data when a userId is received.
		get( lastSetVal, resolve ) {
			if ( lastSetVal ) {
				return lastSetVal;
			}
			if ( this.userId ) {
				User.get( { _id: this.userId } ).then( resolve );
			}
		}
	}
} );

connect( [

	// Include the feathers session behavior in the behaviors list.
	feathersSession,
	dataParse,
	canMap,
	canRef,
	construct,
	constructStore,
	constructCallbacksOnce,

	// Include the realtime behavior.
	realtime,
	dataCallbacks
], {

	// Pass the feathers client as the `feathersClient` property.
	feathersClient: feathersClient,
	idProp: "exp",
	Map: Session,
	name: "session"
} );
```

### Obtaining current session data

Once authentication has been established, the Map or DefineMap provided as the `Map` option on the can-connect Model will have a new `current` property defined.  So, if you passed a `Session` object, `Session.current` will always hold the current session data.  This greatly simplifies the session property in your application ViewModel.  Here's an abbreviated example.

```js
import Session from "my-app/models/session";

const AppViewModel = DefineMap.extend( {
	session: {
		get() {
			return Session.current;
		}
	}
} );
```

That's it!  The `session` property in the above example will automatically populate when the user authenticates.

### Handling OAuth Logins

The `feathers-session` behavior is preconfigured to listen to `login` messages coming in over the [feathers-authentication-popups](https://github.com/feathersjs/feathers-authentication-popups) `authAgent`.  When any message is received through the `authAgent`, its validity is checked.  If it's a valid JWT token, a Session instance will be created automatically.  This will both populate `Session.current` and dispatch a `created` event on the connected Session Map.
