/*can-connect-feathers@1.0.0#utils*/
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
    return {
        get stripSlashes() {
            return stripSlashes;
        },
        get addAliases() {
            return addAliases;
        },
        __esModule: true
    };
});