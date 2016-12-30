@function can-connect-feathers/service/service.data-methods.getData getData
@parent can-connect-feathers/service/service.data-methods

@signature `getData(params)`

Calls the [can-connect-feathers/service/service.options.feathersService feathersService] `get` method to retrieve instance data for the provided `params`.

@param {Object} params A object that represents the set of data needed to be loaded.
@return {Promise<Object>} A promise that resolves to the instance data.