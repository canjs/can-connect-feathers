var connect = require('can-connect');

module.exports = connect.behavior('data/feathers-service', function () {
	var helpURL = 'https://canjs.com/doc/can-connect-feathers.html';
	if (!this.feathersService) {
		throw new Error('You must provide a feathersService to the feathers-service behavior: ' + helpURL);
	}

	var service = this.feathersService;

	return {
		init: function () {
			var self = this;
			// Connect to real-time events.
			service.on('created', function (message) { self.createInstance(message); });
			service.on('updated', function (message) { self.updateInstance(message); });
			service.on('patched', function (message) { self.updateInstance(message); });
			service.on('removed', function (message) { self.destroyInstance(message); });
		},

		getListData: function (params) {
			return service.find({query: params});
		},

		getData: function (params) {
			var id = null;
			if (typeof params === 'string' || typeof params === 'number') {
				id = params;
				params = {};
			} else if (params && typeof params[this.idProp] !== 'undefined') {
				id = params[this.idProp];
				delete params[this.idProp];
			}
			return service.get(id, params);
		},

		createData: function (data) {
			return service.create(data);
		},

		updateData: function (instance) {
			return service.update(instance[this.idProp], instance);
		},

		destroyData: function (instance) {
			return service.remove(instance[this.idProp]);
		}
	};
});
