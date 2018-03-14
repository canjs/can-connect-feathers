/*[global-shim-start]*/
(function(exports, global, doEval) {
	// jshint ignore:line
	var origDefine = global.define;

	var get = function(name) {
		var parts = name.split("."),
			cur = global,
			i;
		for (i = 0; i < parts.length; i++) {
			if (!cur) {
				break;
			}
			cur = cur[parts[i]];
		}
		return cur;
	};
	var set = function(name, val) {
		var parts = name.split("."),
			cur = global,
			i,
			part,
			next;
		for (i = 0; i < parts.length - 1; i++) {
			part = parts[i];
			next = cur[part];
			if (!next) {
				next = cur[part] = {};
			}
			cur = next;
		}
		part = parts[parts.length - 1];
		cur[part] = val;
	};
	var useDefault = function(mod) {
		if (!mod || !mod.__esModule) return false;
		var esProps = { __esModule: true, default: true };
		for (var p in mod) {
			if (!esProps[p]) return false;
		}
		return true;
	};

	var hasCjsDependencies = function(deps) {
		return (
			deps[0] === "require" && deps[1] === "exports" && deps[2] === "module"
		);
	};

	var modules =
		(global.define && global.define.modules) ||
		(global._define && global._define.modules) ||
		{};
	var ourDefine = (global.define = function(moduleName, deps, callback) {
		var module;
		if (typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for (i = 0; i < deps.length; i++) {
			args.push(
				exports[deps[i]]
					? get(exports[deps[i]])
					: modules[deps[i]] || get(deps[i])
			);
		}
		// CJS has no dependencies but 3 callback arguments
		if (hasCjsDependencies(deps) || (!deps.length && callback.length)) {
			module = { exports: {} };
			args[0] = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args[1] = module.exports;
			args[2] = module;
		} else if (!args[0] && deps[0] === "exports") {
			// Babel uses the exports and module object.
			module = { exports: {} };
			args[0] = module.exports;
			if (deps[1] === "module") {
				args[1] = module;
			}
		} else if (!args[0] && deps[0] === "module") {
			args[0] = { id: moduleName };
		}

		global.define = origDefine;
		var result = callback ? callback.apply(null, args) : undefined;
		global.define = ourDefine;

		// Favor CJS module.exports over the return value
		result = module && module.exports ? module.exports : result;
		modules[moduleName] = result;

		// Set global exports
		var globalExport = exports[moduleName];
		if (globalExport && !get(globalExport)) {
			if (useDefault(result)) {
				result = result["default"];
			}
			set(globalExport, result);
		}
	});
	global.define.orig = origDefine;
	global.define.modules = modules;
	global.define.amd = true;
	ourDefine("@loader", [], function() {
		// shim for @@global-helpers
		var noop = function() {};
		return {
			get: function() {
				return { prepareGlobal: noop, retrieveGlobal: noop };
			},
			global: global,
			__exec: function(__load) {
				doEval(__load.source, global);
			}
		};
	});
})(
	{},
	typeof self == "object" && self.Object == Object
		? self
		: typeof process === "object" &&
			Object.prototype.toString.call(process) === "[object process]"
			? global
			: window,
	function(__$source__, __$global__) {
		// jshint ignore:line
		eval("(function() { " + __$source__ + " \n }).call(__$global__);");
	}
);

/*can-connect-feathers@4.0.0#service/service*/
define('can-connect-feathers/service/service', [
    'require',
    'exports',
    'module',
    'can-connect'
], function (require, exports, module) {
    var connect = require('can-connect');
    function getIdProp(Model) {
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
                var idProp = getIdProp(this);
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
                var idProp = getIdProp(this);
                return service.update(instance[idProp], instance);
            },
            destroyData: function (instance) {
                var idProp = getIdProp(this);
                return service.remove(instance[idProp]);
            }
        };
    });
});
/*can-connect-feathers@4.0.0#utils/utils*/
define('can-connect-feathers/utils/utils', [
    'require',
    'exports',
    'module',
    'jwt-decode',
    'can-util/js/assign/assign'
], function (require, exports, module) {
    var decode = require('jwt-decode');
    var assign = require('can-util/js/assign/assign');
    function readCookie(name) {
        var nameEQ = name + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    }
    function getStoredToken(storageLocation) {
        var token = readCookie(storageLocation);
        if (!token && (window && window.localStorage || window.sessionStorage)) {
            token = window.sessionStorage.getItem(storageLocation) || window.localStorage.getItem(storageLocation);
        }
        return token;
    }
    function payloadIsValid(payload) {
        return payload && payload.exp * 1000 > new Date().getTime();
    }
    function hasValidToken(storageLocation) {
        var token = getStoredToken(storageLocation);
        if (token) {
            try {
                var payload = decode(token);
                return payloadIsValid(payload);
            } catch (error) {
                return false;
            }
        }
        return false;
    }
    function convertLocalAuthData(originalData) {
        var data = assign({}, originalData);
        if (data && data.strategy === 'local' && data.user) {
            Object.keys(data.user).forEach(function (key) {
                data[key] = data.user[key];
            });
            delete data.user;
        }
        return data;
    }
    module.exports = {
        readCookie: readCookie,
        getStoredToken: getStoredToken,
        hasValidToken: hasValidToken,
        payloadIsValid: payloadIsValid,
        convertLocalAuthData: convertLocalAuthData
    };
});
/*can-connect-feathers@4.0.0#session/storage*/
define('can-connect-feathers/session/storage', function (require, exports, module) {
    module.exports = {
        data: {},
        getStore: function () {
            if (window.doneSsr) {
                var CanZone = window.CanZone || undefined;
                return typeof CanZone === 'undefined' ? this.data : CanZone.current.data;
            }
            return this.data;
        },
        setItem: function (prop, value) {
            var store = this.getStore();
            store[prop] = value;
        },
        getItem: function (prop) {
            var store = this.getStore();
            return store[prop];
        },
        removeItem: function (prop) {
            var store = this.getStore();
            delete store[prop];
        }
    };
});
/*can-connect-feathers@4.0.0#session/session*/
define('can-connect-feathers/session/session', [
    'require',
    'exports',
    'module',
    'can-connect',
    'feathers-errors',
    'feathers-authentication-popups',
    'jwt-decode',
    'can-connect-feathers/utils/utils',
    'can-connect-feathers/utils/utils',
    'can-connect-feathers/utils/utils',
    'can-observation',
    'can-connect-feathers/session/storage'
], function (require, exports, module) {
    var connect = require('can-connect');
    var errors = require('feathers-errors');
    var authAgent = require('feathers-authentication-popups').authAgent;
    var decode = require('jwt-decode');
    var payloadIsValid = require('can-connect-feathers/utils/utils').payloadIsValid;
    var hasValidToken = require('can-connect-feathers/utils/utils').hasValidToken;
    var convertLocalAuthData = require('can-connect-feathers/utils/utils').convertLocalAuthData;
    var Observation = require('can-observation');
    var zoneStorage = require('can-connect-feathers/session/storage');
    module.exports = connect.behavior('data/feathers-session', function (base) {
        var helpURL = 'https://canjs.com/doc/can-connect-feathers.html';
        var feathersClient = this.feathersClient;
        if (!feathersClient) {
            throw new Error('You must provide a feathersClient instance to the feathers-session behavior. See ' + helpURL);
        }
        if (!this.Map) {
            throw new Error('You must provide a Map instance to the feathers-session behavior. See ' + helpURL);
        }
        if (!feathersClient.passport) {
            throw new Error('You must register the feathers-authentication-client plugin before using the feathers-session behavior. See ' + helpURL);
        }
        var options = feathersClient.passport.options;
        var Session = this.Map;
        Object.defineProperty(Session, 'current', {
            get: function () {
                Observation.add(Session, 'current');
                if (zoneStorage.getItem('can-connect-feathers-session') === undefined) {
                    zoneStorage.removeItem('can-connect-feathers-session');
                    Session.get().then(function (session) {
                        zoneStorage.setItem('can-connect-feathers-session', session);
                        Session.dispatch('current', [session]);
                    }).catch(function (error) {
                        zoneStorage.setItem('can-connect-feathers-session', null);
                        Session.dispatch('current', [null]);
                        if (!error.className || error.className.indexOf('not-authenticated') < 0) {
                            return Promise.reject(error);
                        }
                    });
                }
                return zoneStorage.getItem('can-connect-feathers-session');
            }
        });
        Session.on('created', function (ev, session) {
            zoneStorage.setItem('can-connect-feathers-session', session);
            Session.dispatch('current', [session]);
        });
        Session.on('destroyed', function () {
            zoneStorage.removeItem('can-connect-feathers-session');
            Session.dispatch('current', [
                undefined,
                zoneStorage.getItem('can-connect-feathers-session')
            ]);
        });
        return {
            init: function () {
                base.init.apply(this, arguments);
                var connection = this;
                authAgent.on('login', function (token) {
                    try {
                        var payload = decode(token);
                        if (!payloadIsValid(payload)) {
                            throw new Error('invalid token');
                        }
                    } catch (error) {
                        throw new Error('An invalid token was received through the feathers-authentication-popups authAgent');
                    }
                    feathersClient.authenticate({
                        strategy: 'jwt',
                        accessToken: token
                    }).then(function (data) {
                        var payload = decode(data.accessToken);
                        connection.createInstance(payload);
                    });
                });
            },
            createData: function (data) {
                var requestData = convertLocalAuthData(data);
                return feathersClient.authenticate(requestData).then(function (response) {
                    return response.accessToken ? decode(response.accessToken) : response;
                });
            },
            getData: function () {
                return new Promise(function (resolve, reject) {
                    var tokenLocation = options.tokenKey || options.cookie;
                    if (hasValidToken(tokenLocation) && !window.doneSsr) {
                        feathersClient.authenticate().then(function (data) {
                            var payload = decode(data.accessToken);
                            return resolve(payload);
                        }).catch(reject);
                    } else {
                        reject(new errors.NotAuthenticated('Not Authenticated'));
                    }
                });
            },
            destroyData: function (session) {
                return feathersClient.logout().then(function () {
                    return session;
                });
            }
        };
    });
});
/*can-connect-feathers@4.0.0#can-connect-feathers*/
define('can-connect-feathers', [
    'require',
    'exports',
    'module',
    'can-connect-feathers/service/service',
    'can-connect-feathers/session/session'
], function (require, exports, module) {
    module.exports = {
        service: require('can-connect-feathers/service/service'),
        session: require('can-connect-feathers/session/session')
    };
});
/*[global-shim-end]*/
(function(global) { // jshint ignore:line
	global._define = global.define;
	global.define = global.define.orig;
}
)(typeof self == "object" && self.Object == Object ? self : (typeof process === "object" && Object.prototype.toString.call(process) === "[object process]") ? global : window);