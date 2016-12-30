@function can-connect-feathers/session/session.data-methods.getData getData
@parent can-connect-feathers/session/session.data-methods

@signature `getData()`

Uses the [can-connect-feathers/session/session.options.feathersClient feathersClient] `getJWT` method to retrieve and verify the current JSON Web Token (JWT).

@return {Promise<Object>} A promise that resolves to the JWT payload if the token was valid.
