@function can-connect-feathers/session/session.data-methods.createData createData
@parent can-connect-feathers/session/session.data-methods

@signature `createData(sessionData)`

Uses the [can-connect-feathers/session/session.options.feathersClient feathersClient] `authenticate` method to authenticate with a Feathers server.  See the [Feathers Authentication Client documentation](https://docs.feathersjs.com/authentication/client.html) for details about Feathers authentication.  Upon successful authentication, the Feathers server will return a JSON Web Token (JWT) containing information about the current "session".  Note that Feathers uses JWT instead of server sessions.

For Socket.io connections, the current socket connection's state will be marked as authenticated on the server side.

@param {Object} sessionData The serialized data for creating a session.  The `sessionData` payload will vary depending on which authentication strategy is used on the server.  For example, [feathers-authentication-local](https://github.com/feathersjs/feathers-authentication-local) requires an `email` and `password`, but another strategy may have different requirements.
@return {Promise<Object>} A promise that resolves to the server's response.  On success, a JSON Web Token created by the server will be returned.  On error, a [feathers-errors](https://github.com/feathersjs/feathers-errors) instance will be returned.
