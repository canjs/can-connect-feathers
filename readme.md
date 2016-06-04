# can-connect-feathers

[![Build Status](https://travis-ci.org/feathersjs/can-connect-feathers.png?branch=master)](https://travis-ci.org/feathersjs/can-connect-feathers)

The FeathersJS client library for DoneJS and can-connect

## Quick start
Install the plugin:
```
npm install can-connect-feathers --save
```

Instantiate a `Feathers` instance for each Feathers API server:
```js
// models/feathers.js
import Feathers from 'can-connect-feathers';

const feathers = new Feathers();

export default feathers;
```

Use it in your can-connect model:
```js
// models/message.js
import can from 'can';
import superMap from 'can-connect/can/super-map/';
import tag from 'can-connect/can/tag/';
import feathers from './feathers'; // Import the feathers instance.
import 'can/map/define/define';

export const Message = can.Map.extend({
  define: {
    text: { }
  }
});

Message.List = can.List.extend({
  Map: Message
}, {});

export const messageConnection = superMap({
  url: feathers.rest('messages'), // Connect the instance to your model.
  idProp: 'id',
  Map: Message,
  List: Message.List,
  name: 'message'
});

tag('message-model', messageConnection);

// Connect to realtime events.
feathers.io.on('messages created', message => messageConnection.createInstance(message));
feathers.io.on('messages updated', message => messageConnection.updateInstance(message));
feathers.io.on('messages patched', message => messageConnection.updateInstance(message));
feathers.io.on('messages removed', message => messageConnection.destroyInstance(message));

export default Message;
```

Your `Message` model is ready to go with all real-time features in place.

## Usage
See [the usage page](usage.md).

## Authentication
Feathers requires a JWT token in the Authorization header to authenticate requests. This package includes methods to assist with token management.  The `feathers.authenticate()` method persists the token to a storage engine.  Request made through the `feathers.rest()` helper automatically look for the token on the storage engine.  The `feathers.logout()` method removes the token from storage.  Here is an example session model.  The magic happens in the `sessionConnection`.
```js
/* global window */

import can from 'can';
import $ from 'jquery';
import feathers from './feathers';
import connect from 'can-connect';

import 'can-connect/constructor/';
import 'can-connect/can/map/';
import 'can-connect/can/';
import 'can-connect/constructor/store/';
import 'can-connect/constructor/callbacks-once/';
import 'can-connect/data/callbacks/';
import 'can-connect/data/callbacks-cache/';
import 'can-connect/data/combine-requests/';
import 'can-connect/data/inline-cache/';
import 'can-connect/data/parse/';
import 'can-connect/data/url/';
import 'can-connect/fall-through-cache/';
import 'can-connect/real-time/';
import 'can/map/define/define';

var behaviors = [
  'constructor',
  'can-map',
  'constructor-store',
  'data-callbacks',
  'data-combine-requests',
  'data-inline-cache',
  'data-parse',
  'data-url',
  'constructor-callbacks-once'
];

export const Session = can.Map.extend('Session', {
  define: {}
});

Session.List = can.List.extend({
  Map: Session
}, {});

export const sessionConnection = connect(behaviors, {
  parseInstanceProp: 'data',
  url: {
    createData: data => feathers.authenticate(data),
    destroyData: data => feathers.logout().then(() => {
      window.localStorage.clear();
      window.location.pathname = '/';
    })
  },
  idProp: 'id',
  Map: Session,
  List: Session.List,
  name: 'session'
});

export default Session;
```

### API
* `feathers.authenticate(data)` - Can authenticate using either the `tokenEndpoint` or the `localEndpoint`. (see the Configuration section, below).  `token` authentication is the default, so calling `feathers.authenticate()` with no options will attempt to find the token in the storage engine and will send it with the request.  If the token is valid, the Feathers server will return a fresh token.

To authenticate with username and password, pass in an object of this format:
```js
feathers.authenticate({
  type: 'local',
  email: 'email or username',
  password: 'password'
}).then(response => {
  console.log('Yay! I logged in!');
});
```
* `feathers.rest(location, idProp)` - This is used to configure can-connect's `url` behavior.  The `location` is required, but `idProp` is optional if the service uses the default `idProp`. (see the configuration options in the Configuration section.)
* `feathers.logout()` - This simply removes the token from storage.  It's actually synchronous, but returns a promise if you prefer to use one.

## Configuration
When instantiating a `Feathers` instance, you can pass a configuration object to the constructor.  For most applications, the only options that will need to be specified will be the `url` and the `idProp`.
```js
import Feathers from 'can-connect-feathers';

const feathers = new Feathers({
  // The current server is assumed to be the API server.
  url: '',
  // Determines if the token is persisted to the `storage` provider.
  storeToken: true,
  // The storage engine used to persist the token on the client.
  storage: cookieStorage,
  // The key name of the location where the token will be stored.
  tokenLocation: 'ssr-cookie',
  // The default `idProp` for all services.
  idProp: 'id',
  // The endpoint for token authentication.
  tokenEndpoint: 'auth/token',
  // The endpoint for username/password authentication.
  localEndpoint: 'auth/local',
  // Store the token in a cookie for SSR by default.
  ssr: true
});

export feathers;
```

* `url` - This is the base url of the Feathers server with no trailing slash. The default setting assumes that the Feathers and SSR servers are at the same url.
* `storeToken` - A boolean that determines if the token gets persisted to the provided `storage` engine. To truly turn off token storage, you also need to set the `ssr` option to `false`.  Note: This will make it so that the user has to login again after every refresh.
* `storage` - You can provide your own Web Storage-compatible storage engine.  The default storage engine is a [cookie-storage](https://npmjs.org/cookie-storage) instance. Cookies, when used correctly to prevent CSRF attacks, are preferred over localStorage for a couple of reasons.  **(1)** The SSR server needs to be able to access the token on first load.  This is only possible with a cookie. **Because Feathers does not consume the cookie, we don't have to worry about CSRF attacks on the API server. Also, while it's common to enable CORS for the API server, make sure you disable CORS for the SSR server.**   **(2)** localStorage doesn't work in private mode on all browsers.  By using a cookie, the user will be able to still refresh the browser and the cookie will be deleted when the private browsing session ends.
* `tokenLocation` - this is the key name of the location in the `storage` engine.  The default is `feathers-jwt`, which is the same default cookie name used by the [feathers-done-ssr](https://www.npmjs.com/package/feathers-done-ssr) package. The values will need to match on both packages in order for the SSR server to send authenticated requests on behalf of the user.
* `idProp` - This is the key name of the `id` property to be used on all services.  For example, if your Feathers services mostly all use MongoDB, then set this to `_id`.  This can also be customized on a per-service basis.  This means that if most of your services use PostgreSQL, the default `idProp` of `id` will work for those services, but if you have a single NeDB, Mongoose, or MongoDB service, you can specify a different `idProp` in the `feathers.rest()` method.
* `tokenEndpoint` - The endpoint for token authentication.  It needs to match the service location configured on the Feathers server.
* `localEndpoint` - The endpoint for username/password authentication.  It needs to match the service location configured on the Feathers server.
* `ssr` - You can set this to false to prevent the token from being stored in an SSR cookie.  Setting both `ssr` and `storeToken` to false will disable token storage completely.


## Contributing

### Making a Build

To make a build of the distributables into `dist/` in the cloned repository run

```
npm install
node build
```

### Running the tests

Tests can run in the browser by opening a webserver and visiting the `test.html` page.
Automated tests that run the tests from the command line in Firefox can be run with

```
npm test
```

## Changelog
- `0.5.0` - The default cookie name is now `feathers-jwt` to match the Feathers default.
- `0.4.0`
  - The `rest` methods now use a Promise instead of a Deferred.
  - Error responses are now converted to [feathers-errors](http://docs.feathersjs.com/middleware/error-handling.html).
- `0.2.0` - Added socket.io auth to the `authenticate` method to get authenticated real-time events.
- `0.1.0` - Initial version
