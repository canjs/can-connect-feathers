/*can-connect-feathers@1.1.0#utils*/
'use strict';
function stripSlashes(location) {
    return location.replace(/^(\/*)|(\/*)$/g, '');
}
function addAliases(service) {
    service.find = service.getListData;
    service.get = service.getData;
    service.create = service.createData;
    service.update = service.updateData;
    service.patch = service.patchData;
    service.remove = service.destroyData;
    return service;
}
Object.defineProperties(module.exports, {
    stripSlashes: {
        get: function () {
            return stripSlashes;
        }
    },
    addAliases: {
        get: function () {
            return addAliases;
        }
    },
    __esModule: { value: true }
});