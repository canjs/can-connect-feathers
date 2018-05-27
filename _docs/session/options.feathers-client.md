@property {FeathersClient} can-connect-feathers/service/service.options.feathersClient feathersClient
@parent can-connect-feathers/session/session.options

@type {FeathersClient}

Specifies a FeathersClient instance to use for authentication.  The [feathers-authentication-client plugin](https://github.com/feathersjs/feathers-authentication-client) is required.  See the [can-connect-feathers] page for an example Feathers Client configuration.

```js
// Bring in the feathers client instance.
import feathersClient from "./feathers";

connect( [
	feathersSession
], {

	// Pass the feathers client as the `feathersClient` property.
	feathersClient: feathersClient
} );
```

See [can-connect-feathers/session/session] for a complete Session Model example.