# can-connect-feathers

[![Build Status](https://travis-ci.org/canjs/can-connect-feathers.png?branch=master)](https://travis-ci.org/canjs/can-connect-feathers)

 [![Sauce Test Status](https://saucelabs.com/browser-matrix/canjs.svg)](https://saucelabs.com/u/canjs)


`can-connect-feathers` is a set of behaviors for integrating [can-connect](http://canjs.com/doc/can-connect.html)  with [Feathers Client](https://docs.feathersjs.com/clients/feathers.html).

 - The service behavior connects to a Feathers service.
 - The session behavior connects to the [feathers-authentication-client](https://docs.feathersjs.com/authentication/client.html) methods on a Feathers Client instance.

 > Important Note:  Version 3.0 is not yet fully compatible with Done-SSR.  If you need SSR, please install the `2.x` version from npm and check the `2.x` branch's README.md for docs.


## Table of Contents

- [Feathers Client Setup](#feathers-client-setup)
- [Connecting to Services with the Service Behavior](#connecting-to-services-with-the-service-behavior)
  - [Service behavior options](#service-behavior-options)
  - [Service Behavior Example](#service-behavior-example)
- [Handling Authentication with the Session Behavior](#handling-authentication-with-the-session-behavior)
  - [Session Behavior Options](#session-behavior-options)
  - [Obtaining current session data](#obtaining-current-session-data)
  - [Handling OAuth Logins](#handling-oauth-logins)
  - [Service Behavior Example](#service-behavior-example)
- [Contributing](#contributing)
- [Changelog](#changelog)

## Install

```
npm install can-connect-feathers --save
```

## Feathers Client Setup

Both of the included behaviors require a Feathers Client instance.  Here is a basic setup: 

```js
// models/feathers.js
import feathers from 'feathers/client';
import socketio from 'feathers-socketio/client';
import io from 'socket.io-client/dist/socket.io';
import hooks from 'feathers-hooks';
import auth from 'feathers-authentication-client';
import socket from '';

var feathersClient = feathers()
  .configure(hooks())
  .configure(socketio(socket))
  .configure(auth());

export default feathersClient;
```

See the [FeathersJS Documentation](http://docs.feathersjs.com) for more details.

## Connecting to Services with the Service Behavior

The service behavior simplifies the process of connecting to a Feathers service.  It maps can-connect's DataInterface methods to FeathersJS's [Service Interface](https://docs.feathersjs.com/services/readme.html#service-methods) methods.

| DataInterface method | Feathers method | HTTP method | Example Path |
|----------------------|-----------------|-------------|--------------|
| .getListData()       | .find()         | GET         | /todos       |
| .getData()           | .get()          | GET         | /todos/{id}  |
| .createData()        | .create()       | POST        | /todos       |
| .updateData()        | .update()       | PUT         | /todos/{id}  |
| not yet implemented  | .patch()        | PATCH       | /todos/{id}  |
| .destroyData()       | .remove()       | DELETE      | /todos/{id}  | 


## Service Behavior Options

The service behavior requires that a Feathers service object be passed as the `feathersService` option.  For can-connect's real-time functionality to work with this behavior, the [can-connect real-time behavior](http://canjs.com/doc/can-connect/real-time/real-time.html) must also be included as shown in the examples.

Here's an abbreviated example.  See the next section for a full example.

```js
connect([
  feathersService,
  realtime
], {
  feathersService: feathersClient.service('/api/todos')
});
```

### Service Behavior Example

Here's an example Todo Model that uses the can-connect-feathers service behavior.  Comments indicating key locations have been added.

```js
// models/todo.js
import connect from 'can-connect';
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/list';
import set from "can-set";

// Bring in the feathers service behavior
import feathersServiceBehavior from 'can-connect-feathers/service';
import dataParse from 'can-connect/data/parse/';
import realtime from 'can-connect/real-time/';
import construct from 'can-connect/constructor/';
import constructStore from 'can-connect/constructor/store/';
import constructOnce from 'can-connect/constructor/callbacks-once/';
import canMap from 'can-connect/can/map/';
import canRef from 'can-connect/can/ref/';
import dataCallbacks from 'can-connect/data/callbacks/';

// Bring in the feathersClient instance.
import feathersClient from './feathers';

// Use feathersClient.service(url) to create a service
const todoService = feathersClient.service('/api/todos');

const Todo = DefineMap.extend('Todo', {
  _id: 'string',
  description: 'string',
  complete: 'boolean'
});

Todo.algebra = new set.Algebra(
  set.comparators.id('_id')
);

Todo.List = DefineList.extend({'*': Todo});

Todo.connection = connect([
  // Include the feathers service behavior in the behaviors list.
  feathersServiceBehavior,
  dataParse,
  construct,
  constructStore,
  constructCallbacksOnce,
  canMap,
  canRef,
  dataCallbacks,
  // Include the realtime behavior.
  realtime
], {
  idProp: '_id',
  Map: Todo,
  List: Todo.List,
  // Pass the service as the `feathersService` property.
  feathersService: todoService,
  name: 'todos',
  algebra: Todo.algebra
});

export default Todo;
```

In the above example, both `Todo` and `Todo.connection` will have methods for handling data, as described in the [can-connect basic use](http://canjs.com/doc/can-connect.html#BasicUse) section.


## Handling Authentication with the Session Behavior

The session behavior connects some of can-connect's DataInterface methods to the [feathers-authentication-client](https://github.com/feathersjs/feathers-authentication-client) plugin.

- `createData()` attempts to authenticate with the Feathers server, which upon success returns a JSON Web Token (JWT).  The JWT contains a payload with information about the current session.  That payload is returned as the session object.
 - `getData()` validates a stored JWT and returns its payload if the token hasn't expired.
 - `destroyData()` unauthenticates from the server and discards the JWT token on the client.


### Session Behavior Options

The session behavior requires that a FeathersClient instance be passed as the `feathersClient` option.  For can-connect's real-time functionality to work with this behavior, the [can-connect real-time behavior](http://canjs.com/doc/can-connect/real-time/real-time.html) must also be included as shown in the examples.  Also, this behavior requires that an observable Map or DefineMap is provided on the `Map` attribute.

```js
connect([
  feathersSession,
  realtime
], {
  feathersClient: feathersClient,
  Map: Session
});
```

> Pro Tip: Remember that the term "session" here is only for familiarity, since FeathersJS uses stateless JWT and not actual sessions on the server.

### Obtaining current session data

Once authentication has been established, the Map or DefineMap provided as the `Map` option on the can-connect Model will have a new `current` property defined.  So, if you passed a `Session` object, `Session.current` will always hold the current session data.  This greatly simplifies the session property in your application ViewModel.  Here's an abbreviated example.

```js
import Session from 'my-app/models/session';

const AppViewModel = DefineMap.extend({
  session: {
    get () {
      return Session.current;
    }
  }
});
```

That's it!  The `session` property in the above example will automatically populate when the user authenticates.

### Handling OAuth Logins

The `feathers-session` behavior is preconfigured to listen to `login` messages coming in over the [feathers-authentication-popups](https://github.com/feathersjs/feathers-authentication-popups) `authAgent`.  When any message is received through the `authAgent`, its validity is checked.  If it's a valid JWT token, a Session instance will be created automatically.  This will both populate `Session.current` and dispatch a `created` event on the connected Session Map.

### Session Behavior Example

Here's an example Todo Model that uses the can-connect-feathers service behavior.  Comments indicating key locations have been added.  Also note that you'll need to setup a `User` Model for this example to work.  It should use the `service` behavior.

```js
import connect from 'can-connect';
import DefineMap from 'can-define/map/';

import feathersSessionBehavior from 'can-connect-feathers/session';
import dataParse from 'can-connect/data/parse/';
import construct from 'can-connect/constructor/';
import constructStore from 'can-connect/constructor/store/';
import constructCallbacksOnce from 'can-connect/constructor/callbacks-once/';
import canMap from 'can-connect/can/map/';
import canRef from 'can-connect/can/ref/';
import dataCallbacks from 'can-connect/data/callbacks/';

// Bring in the feathersClient instance.
import feathersClient from './feathers';

export const Session = DefineMap.extend('Session', {
  seal: false
}, {
  exp: 'any',
  userId: 'any',
  user: {
    Type: User,
    // Automatically populate the user data when a userId is received.
    get (lastSetVal, resolve) {
      if (lastSetVal) {
        return lastSetVal;
      }
      if (this.userId) {
        User.get({_id: this.userId}).then(resolve);
      }
    }
  }
});

connect([
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
  idProp: 'exp',
  // Pass the Session Map
  Map: Session,
  name: 'session'
});

export default Session;
```

## Contributing

### Making a Build

To make a build of the distributables into `dist/` in the cloned repository run

```
npm install
npm run build
```

### Running the tests

Run tests manually with `npm run start` then visit [http://localhost:3333/test/test.html](http://localhost:3333/test/test.html).

Automated tests from the command line can be run in Firefox with `npm test`.

## Changelog
- `3.0.0`
  - This is a big update with a dramatically different API.  
  - Not yet compatible with Done-SSR.  Keep using the `2.x.x` version if you need SSR.
  - You can now directly use the official Feathers Client library.
  - Includes a service behavior for connecting to Feathers services.
  - Includes a session behavior for assisting with Feathers's JWT authentication.
    - Requires the `feathers-authentication-client` library to be used in the Feathers Client setup.
    - Augments the provided `Map` constructor with a `current` property.  ie. Your `Session` Map will now have a `Session.current` property with the authenticated "session" data.  Remember that the term "session" is just a formality here, since Feathers uses stateless JWT and not actual sessions on the server.
    - Includes `feathers-authentication-popups` support for automatically handling OAuth provider logins (Twitter, Facebook, GitHub)
- `2.0.0` 
  - This version is exactly the same as the `1.x.x` versions with a single breaking change.
  - Solved a bug where the internal version of jQuery would conflict with the version used in your app. Added `jquery` as a required option.  You must provide the version of `jquery` that you plan to use in your app.
- `1.1.7` - Feature: `getToken()` will always attempt to retrieve the token from `cookieStorage` after checking `localStorage`.   
- `1.1.6` - Bugfix: Adds makeUrl function to fix URLs and rest query strings.
- `1.1.5` - Bugfix: Don't stringify empty objects in the XHR data.
- `1.1.4` - Feature: Add a .vscode config for easier debugging with Visual Studio Code.
- `1.1.3` - Bugfix: Make sure the `feathers.io.on`, `feathers.io.once`, and `feathers.io.off` methods are always available, so you don't have to remove them when you set `allowSocketIO` to `false`, temporarily.
- `1.1.2` - Added some documentation.
- `1.1.1` - Added tests for auth over XHR/REST.
- `1.1.0` - Feature: Can now authenticate directly with socket.io
- `1.0.0`
  - Adds full socket.io support. Going all-in on socket.io is much faster and more efficient than the hybrid `rest`/ real-time events setup!
  - Renamed the `socketio` option to `allowSocketIO`. Now you pass `allowSocketIO: false` to disable sockets.
  - Added `socketio` method to support socket.io as a transport for services.
  - Added integration tests with an actual Feathers server.
- `0.6.9` - Bugfix: Allow socket.io to connect to non-origin servers. (Upgrade steal-socket.io)
- `0.6.8` - Bugfix: Don't send data with DELETE requests. Thanks @kylegifford!
- `0.6.7` - Feature: Allow passing of id into `get` as an object literal `{_id: 1}`, in addition to string and number ids.  Thanks @obaidott!
- `0.6.6` - Bugfix: disable JSON stringify for params, prevent params from being double stringified. Thanks @obaidott!
- `0.6.0` - it's now possible to turn off socket.io by passing `socketio = false` to the options. This has been renamed as of version `1.0.0`.
- `0.5.0` - The default cookie name is now `feathers-jwt` to match the Feathers default.
- `0.4.0`
  - The `rest` methods now use a Promise instead of a Deferred.
  - Error responses are now converted to [feathers-errors](http://docs.feathersjs.com/middleware/error-handling.html).
- `0.2.0` - Added socket.io auth to the `authenticate` method to get authenticated real-time events.
- `0.1.0` - Initial version
