@function can-connect-feathers/service/service.data-methods.destroyData destroyData
@parent can-connect-feathers/service/service.data-methods

@signature `destroyData(instanceData)`

Calls the [can-connect-feathers/service/service.options.feathersService feathersService] `remove` method with the provided serialized `instanceData`.

@param {Object} instanceData The serialized data of the instance.
@return {Promise<Object>} A promise that resolves to the deleted instance data.
