@function can-connect-feathers/service/service.data-methods.getListData getListData
@parent can-connect-feathers/service/service.data-methods

@signature `getListData(set)`

Calls the [can-connect-feathers/service/service.options.feathersService feathersService] `find` method to retrieve list data for a particular `set`.

@param {can-query-logic/query} set A object that represents the set of data needed to be loaded.  The `set` object is passed to the Feathers service's `find` method as the query params: `.find({query: set})`.
@return {Promise<can-connect.listData>} A promise that resolves to the ListData format.
