@function can-connect-feathers/service/service.data-methods.createData createData
@parent can-connect-feathers/service/service.data-methods

@signature `createData(instanceData, cid)`

Uses the [can-connect-feathers/service/service.options.feathersService feathersService] `create` method with the provided serialized `instanceData`.

@param {Object} instanceData The serialized data of the instance.
@param {Number} cid A unique id that represents the instance that is being created.
@return {Promise<Object>} A promise that resolves to the newly created instance data.
