/*can-connect-feathers@1.1.5#utils*/
define([], function () {
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
    return {
        get stripSlashes() {
            return stripSlashes;
        },
        get addAliases() {
            return addAliases;
        },
        get isEmptyObject() {
            return isEmptyObject;
        },
        __esModule: true
    };
});