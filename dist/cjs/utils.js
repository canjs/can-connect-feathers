/*can-connect-feathers@1.2.1#utils*/
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
function isEmptyObject(obj) {
    for (var prop in obj) {
        return false;
    }
    return true;
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
    isEmptyObject: {
        get: function () {
            return isEmptyObject;
        }
    },
    __esModule: { value: true }
});