@function can-connect-feathers/service/service.data-methods.updateData updateData
@parent can-connect-feathers/service/service.data-methods

@signature `updateData(instanceData)`

Calls the [can-connect-feathers/service/service.options.feathersService feathersService] `update` method with the provided serialized `instanceData`.

@param {Object} instanceData The serialized data of the instance.
@return {Promise<Object>} A promise that resolves to the updated instance data.
