@property {FeathersService} can-connect-feathers/service/service.options.feathersService feathersService
@parent can-connect-feathers/service/service.options

@type {FeathersService}

Specifies a [FeathersClient](https://docs.feathersjs.com/clients/feathers.html) Service instance to use for the data connection.  See the [can-connect-feathers] page for an example Feathers Client configuration.

```js
// Bring in the feathersClient instance and setup a service.
import feathersClient from "./feathers";

const todoService = feathersClient.service( "/api/todos" );

connect( [
	feathersService,
	realtime
], {

	// Pass the service as the `feathersService` property
	feathersService: todoService
} );
```

See [can-connect-feathers/service/service] for a complete Todo Model example.