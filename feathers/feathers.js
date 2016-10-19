const connect = require('can-connect');

module.exports = connect.behavior('data/feathers', function () {
  let helpURL = 'http://canjs.github.io/canjs/doc/can-connect-feathers.html';
  if (!service) {
    throw new Error('You must provide a Feathers service to the feathersBehavior: ' + helpURL);
  }

  const service = this.service;

  // Connect to realtime events.
  service.on('created', message => this.createInstance(message));
  service.on('updated', message => this.updateInstance(message));
  service.on('patched', message => this.updateInstance(message));
  service.on('removed', message => this.destroyInstance(message));

  return {
    getListData (params) {
      return service.find(params);
    },

    getData (params) {
      let id = null;
      if (typeof params === 'string' || typeof params === 'number') {
        id = params;
        params = {};
      }
      return service.get(id, params);
    },

    createData (data) {
      return service.create(data);
    },

    updateData (instance) {
      return service.update(instance[this.idProp], instance);
    },

    destroyData (instance) {
      return service.remove(instance[this.idProp]);
    }
  };
});
