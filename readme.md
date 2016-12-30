# can-connect-feathers

[![Build Status](https://travis-ci.org/canjs/can-connect-feathers.png?branch=master)](https://travis-ci.org/canjs/can-connect-feathers)

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
import $ from 'jquery';

const feathers = new Feathers({
  jquery: $
});

export default feathers;
```

> Note: The `jquery` config option is required as of version 2.0

Use it in your can-connect model:
```js
// models/message.js
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import superMap from 'can-connect/can/super-map/';
import tag from 'can-connect/can/tag/';
import feathers from './feathers'; // Import the feathers instance.

export const Message = DefineMap.extend({
  text: 'string'
});

Message.List = DefineList.extend({
  '*': Message
});

export const messageConnection = superMap({
  url: feathers.socketio('/api/messages'), // Connect the instance to your model.
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
It's possible to use this plugin with or without DoneSSR.  If you're using SSR, you must have the [feathers-rest](http://docs.feathersjs.com/rest/readme.html) provider configured on your Feathers server.

See [the usage page](usage.md) for more details.

## Authentication
Feathers requires a JWT token in the Authorization header to authenticate requests. This package includes methods to assist with token management.  The `feathers.authenticate()` method persists the token to a storage engine.  Request made through the `feathers.rest()` helper automatically look for the token on the storage engine.  The `feathers.logout()` method removes the token from storage.  Here is an example session model.  The magic happens in the `sessionConnection`.

```js
/* global window */

import feathers from './feathers';
import connect from 'can-connect';
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';

import dataUrl from 'can-connect/data/url/';
import dataParse from 'can-connect/data/parse/';
import construct from 'can-connect/constructor/';
import constructStore from 'can-connect/constructor/store/';
import constructOnce from 'can-connect/constructor/callbacks-once/';
import canMap from 'can-connect/can/map/';
import canRef from 'can-connect/can/ref/';
import dataCallbacks from 'can-connect/data/callbacks/';
import realtime from 'can-connect/real-time/';

var behaviors = [
  dataUrl,
  dataParse,
  construct,
  constructStore,
  constructOnce,
  canMap,
  canRef,
  dataCallbacks,
  realtime
];

export const Session = DefineMap.extend('Session', {
  _id: '*',
  username: 'string',
  password: 'string'
});

Session.List = DefineList.extend({
  '*': Session
});

export const sessionConnection = connect(behaviors, {
  url: {
    createData: data => feathers.authenticate(data),
    destroyData: data => feathers.logout().then(() => {
      window.localStorage.clear();
      window.location.pathname = '/';
    })
  },
  idProp: '_id',
  Map: Session,
  List: Session.List,
  name: 'session'
});

export default Session;
```

### API
* `feathers.authenticate(data)` - Can authenticate using either the `tokenEndpoint` or the `localEndpoint`. (see the Configuration section, below).  `token` authentication is the default, so calling `feathers.authenticate()` with no options will attempt to find the token in the storage engine and will send it with the request.  If the token is valid, the Feathers server will return a fresh token.  Whether using `rest` or `socketio` services, the `authenticate` method will attempt to authenticate a socket connection unless you use `allowSocketIO: false` in the options.

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
* `feathers.rest(location, idProp)` - This is used to configure can-connect's `url` behavior to use the REST adapter (XHR).  The `location` is required, but `idProp` is optional if the service uses the default `idProp`. (see the configuration options.)
* `feathers.socketio(location, idProp)` - This is used to configure can-connect's `url` behavior to use the Socket.io adapter.  The `location` is required, but `idProp` is optional if the service uses the default `idProp`. (see the configuration options.)  During Server Side Rendering, requests will go over XHR, since DoneSSR doesn't have support for socket.io.
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
  ssr: true,
  // Set to false to disable socketio and force any socketio services to switch to rest.
  allowSocketIO: true,
  // Options passed to the socket.io connection manager.
  socketOptions: {
    // Force socket.io-client to use websockets (if browser doesn't support websockets, this fails.)
    transports: ['websocket'],
    // Forces socket.io to open a new websocket instead of reusing an existing one.
    forceNew: true
  }
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
* `allowSocketIO` - A boolean that determines if socket.io is enabled.  If set to `false`, any services that use the `socketio` method will fall back to using `rest`.  Default is `true`.
* `socketOptions` An object literal that gets passed to the socket.io connection.  Available options can be found in the [socket.io-client docs](https://github.com/socketio/socket.io-client#managerurlstring-optsobject) ).


## Contributing

### Making a Build

To make a build of the distributables into `dist/` in the cloned repository run

```
npm install
node build
```

### Running the tests

Run tests manually with `npm run start` then visit [http://localhost:3333/test/test.html](http://localhost:3333/test/test.html).

Automated tests from the command line can be run in Firefox with `npm test`.

## Changelog
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
