@function can-connect-feathers/session/session.data-methods.destroyData destroyData
@parent can-connect-feathers/session/session.data-methods

@signature `destroyData()`

Uses the [can-connect-feathers/session/session.options.feathersClient feathersClient] `logout` method to remove the current JSON Web Token from the client.  See the [Feathers Authentication Client documentation](https://docs.feathersjs.com/authentication/client.html) for details about Feathers authentication.

For Socket.io connections, the current socket connection's state will be marked as unauthenticated on the server side.

@return {Promise<Object>} A promise that resolves to a success message.
