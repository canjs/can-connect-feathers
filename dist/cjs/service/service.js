/*can-connect-feathers@3.5.3#service/service*/
var connect = require('can-connect');
function getIdProp(model, idProp) {
    var algebraIdProp;
    var algebraClause = model.algebra && model.algebra.clauses && model.algebra.clauses.id;
    if (algebraClause) {
        algebraIdProp = Object.keys(algebraClause)[0];
    }
    if (!algebraIdProp && !idProp) {
        throw new Error('An idProp was not set in the Model for ' + model + '. Things may not work as expected.');
    }
    return algebraIdProp || idProp;
}
module.exports = connect.behavior('data/feathers-service', function () {
    var helpURL = 'https://canjs.com/doc/can-connect-feathers.html';
    if (!this.feathersService) {
        throw new Error('You must provide a feathersService to the feathers-service behavior: ' + helpURL);
    }
    var service = this.feathersService;
    return {
        init: function () {
            var self = this;
            service.on('created', function (message) {
                self.createInstance(message);
            });
            service.on('updated', function (message) {
                self.updateInstance(message);
            });
            service.on('patched', function (message) {
                self.updateInstance(message);
            });
            service.on('removed', function (message) {
                self.destroyInstance(message);
            });
        },
        getListData: function (params) {
            return service.find({ query: params });
        },
        getData: function (params) {
            var id = null;
            var idProp = getIdProp(this, this.idProp);
            if (typeof params === 'string' || typeof params === 'number') {
                id = params;
                params = {};
            } else if (params && typeof params[idProp] !== 'undefined') {
                id = params[idProp];
                delete params[idProp];
            }
            return service.get(id, params);
        },
        createData: function (data) {
            return service.create(data);
        },
        updateData: function (instance) {
            var idProp = getIdProp(instance, this.idProp);
            return service.update(instance[idProp], instance);
        },
        destroyData: function (instance) {
            var idProp = getIdProp(instance, this.idProp);
            return service.remove(instance[idProp]);
        }
    };
});