/**
 * Normalizes provided URLs by removing slashes from start and finish.
 */
export function stripSlashes(location) {
  return location.replace(/^(\/*)|(\/*)$/g, '');
}


/**
 * Alias the Feathers service methods to can-connect methods so either will work.
 */
export function addAliases(service){
  service.find = service.getListData;
  service.get = service.getData;
  service.create = service.createData;
  service.update = service.updateData;
  service.patch = service.patchData;
  service.remove = service.destroyData;
  return service;
}

export function isEmptyObject(obj){
	for(var prop in obj) { // jshint ignore:line
		return false;
	}
	return true;
}
