"use strict";
var connect = require('can-connect');

function getIdProp (Model) {
	var algebraIdProp;
	var algebraClause = Model.algebra && Model.algebra.clauses && Model.algebra.clauses.id;
	if (algebraClause) {
		algebraIdProp = Object.keys(algebraClause)[0];
	}
	if (!algebraIdProp && !Model.idProp) {
		throw new Error('An idProp was not set in the Model for ' + Model + '. Things may not work as expected.');
	}
	return algebraIdProp || Model.idProp;
}

module.exports = connect.behavior('data/feathers-service', function (base) {
	var helpURL = 'https://canjs.com/doc/can-connect-feathers.html';
	if (!this.feathersService) {
		throw new Error('You must provide a feathersService to the feathers-service behavior: ' + helpURL);
	}

	var service = this.feathersService;

	return {
		init: function () {
			base.init.apply(this, arguments);
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
			var idProp = getIdProp(this);
			if (typeof params === 'string' || typeof params === 'number') {
				id = params;
				params = {};
			} else if (params && typeof params[idProp] !== 'undefined') {
				id = params[idProp];
				delete params[idProp];
			}
			return service.get(id, {query: params});
		},

		createData: function (data) {
			return service.create(data);
		},

		updateData: function (instance) {
			var idProp = getIdProp(this);
			return service.update(instance[idProp], instance);
		},

		destroyData: function (instance) {
			var idProp = getIdProp(this);
			return service.remove(instance[idProp]);
		}
	};
});
