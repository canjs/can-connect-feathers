const connect = require('can-connect');

module.exports = connect.behavior('data/feathers', function () {
  // Connect to realtime events.
  this.service.on('created', message => this.createInstance(message));
  this.service.on('updated', message => this.updateInstance(message));
  this.service.on('patched', message => this.updateInstance(message));
  this.service.on('removed', message => this.destroyInstance(message));

  return {
    getListData (params) {
      return this.service.find(params);
    },

    getData (params) {
      let id = null;
      if (typeof params === 'string' || typeof params === 'number') {
        id = params;
        params = {};
      }
      return this.service.get(id, params);
    },

    createData (data) {
      return this.service.create(data);
    },

    updateData (instance) {
      return this.service.update(instance[this.idProp], instance);
    },

    destroyData (instance) {
      return this.service.remove(instance[this.idProp]);
    }
  };
});
