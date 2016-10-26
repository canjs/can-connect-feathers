/*can-connect-feathers@2.0.0-beta.1#feathers/feathers*/
var connect = require('can-connect');
module.exports = connect.behavior('data/feathers', function () {
    var helpURL = 'http://canjs.github.io/canjs/doc/can-connect-feathers.html';
    if (!this.feathersService) {
        throw new Error('You must provide a feathersService to the feathersBehavior: ' + helpURL);
    }
    var service = this.feathersService;
    service.on('created', message => this.createInstance(message));
    service.on('updated', message => this.updateInstance(message));
    service.on('patched', message => this.updateInstance(message));
    service.on('removed', message => this.destroyInstance(message));
    return {
        getListData(params) {
            return service.find(params);
        },
        getData(params) {
            var id = null;
            if (typeof params === 'string' || typeof params === 'number') {
                id = params;
                params = {};
            }
            return service.get(id, params);
        },
        createData(data) {
            return service.create(data);
        },
        updateData(instance) {
            return service.update(instance[this.idProp], instance);
        },
        destroyData(instance) {
            return service.remove(instance[this.idProp]);
        }
    };
});