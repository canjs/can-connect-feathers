/*[global-shim-start]*/
(function(exports, global, doEval){ // jshint ignore:line
	var origDefine = global.define;

	var get = function(name){
		var parts = name.split("."),
			cur = global,
			i;
		for(i = 0 ; i < parts.length; i++){
			if(!cur) {
				break;
			}
			cur = cur[parts[i]];
		}
		return cur;
	};
	var modules = (global.define && global.define.modules) ||
		(global._define && global._define.modules) || {};
	var ourDefine = global.define = function(moduleName, deps, callback){
		var module;
		if(typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for(i =0; i < deps.length; i++) {
			args.push( exports[deps[i]] ? get(exports[deps[i]]) : ( modules[deps[i]] || get(deps[i]) )  );
		}
		// CJS has no dependencies but 3 callback arguments
		if(!deps.length && callback.length) {
			module = { exports: {} };
			var require = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args.push(require, module.exports, module);
		}
		// Babel uses the exports and module object.
		else if(!args[0] && deps[0] === "exports") {
			module = { exports: {} };
			args[0] = module.exports;
			if(deps[1] === "module") {
				args[1] = module;
			}
		} else if(!args[0] && deps[0] === "module") {
			args[0] = { id: moduleName };
		}

		global.define = origDefine;
		var result = callback ? callback.apply(null, args) : undefined;
		global.define = ourDefine;

		// Favor CJS module.exports over the return value
		modules[moduleName] = module && module.exports ? module.exports : result;
	};
	global.define.orig = origDefine;
	global.define.modules = modules;
	global.define.amd = true;
	ourDefine("@loader", [], function(){
		// shim for @@global-helpers
		var noop = function(){};
		return {
			get: function(){
				return { prepareGlobal: noop, retrieveGlobal: noop };
			},
			global: global,
			__exec: function(__load){
				doEval(__load.source, global);
			}
		};
	});
}
)({},window,function(__$source__, __$global__) { // jshint ignore:line
	eval("(function() { " + __$source__ + " \n }).call(__$global__);");
}
)
/*can-connect-feathers@2.0.0-beta.1#feathers/feathers*/
define('can-connect-feathers/feathers/feathers', function (require, exports, module) {
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
});
/*can-connect-feathers@2.0.0-beta.1#can-connect-feathers*/
define('can-connect-feathers', function (require, exports, module) {
    module.exports = require('can-connect-feathers/feathers/feathers');
});
/*[global-shim-end]*/
(function(){ // jshint ignore:line
	window._define = window.define;
	window.define = window.define.orig;
}
)();