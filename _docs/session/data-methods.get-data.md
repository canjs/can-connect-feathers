@function can-connect-feathers/session/session.data-methods.getData getData
@parent can-connect-feathers/session/session.data-methods

@signature `getData()`

Makes a request to the authentication endpoint to verify that the token is valid.

@return {Promise<Object>} A promise that resolves to the JWT payload if the token was valid.
