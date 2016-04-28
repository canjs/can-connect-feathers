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
/*can-connect-feathers@0.2.1#utils*/
define('can-connect-feathers/utils', ['exports'], function (exports) {
    'use strict';
    Object.defineProperty(exports, '__esModule', { value: true });
    exports.stripSlashes = stripSlashes;
    function stripSlashes(location) {
        return location.replace(/^(\/*)|(\/*)$/g, '');
    }
});
/*can-connect-feathers@0.2.1#can-connect-feathers*/
define('can-connect-feathers', [
    'exports',
    'module',
    'steal-socket.io',
    'jquery',
    'cookie-storage',
    'jwt-decode',
    'can-connect-feathers/utils'
], function (exports, module, _stealSocketIo, _jquery, _cookieStorage, _jwtDecode, _utils) {
    'use strict';
    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ('value' in descriptor)
                    descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        return function (Constructor, protoProps, staticProps) {
            if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
                defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { 'default': obj };
    }
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function');
        }
    }
    var _io = _interopRequireDefault(_stealSocketIo);
    var _$ = _interopRequireDefault(_jquery);
    var _decode = _interopRequireDefault(_jwtDecode);
    var cookieStorage = new _cookieStorage.CookieStorage();
    var Feathers = function () {
        function Feathers(config) {
            _classCallCheck(this, Feathers);
            var defaults = {
                url: '',
                storeToken: true,
                storage: cookieStorage,
                tokenLocation: 'ssr-cookie',
                idProp: 'id',
                tokenEndpoint: 'auth/token',
                localEndpoint: 'auth/local',
                ssr: true
            };
            _$['default'].extend(this, defaults, config);
            this.io = (0, _io['default'])(this.url);
        }
        _createClass(Feathers, [
            {
                key: 'rest',
                value: function rest(location, idProp) {
                    var self = this;
                    idProp = idProp || this.idProp;
                    var service = {
                        getListData: function getListData(params) {
                            return self.makeXhr(null, params, location);
                        },
                        getData: function getData(params) {
                            if (typeof params === 'string') {
                                var id = params;
                                params = {};
                                params[idProp] = id;
                            }
                            return self.makeXhr(params[idProp], params, location);
                        },
                        createData: function createData(data) {
                            return self.makeXhr(null, data, location, 'POST');
                        },
                        updateData: function updateData(data) {
                            return self.makeXhr(data[idProp], data, location, 'PUT');
                        },
                        destroyData: function destroyData(id) {
                            return self.makeXhr(id, null, location, 'DELETE');
                        }
                    };
                    service.find = service.getListData;
                    service.get = service.getData;
                    service.create = service.createData;
                    service.update = service.updateData;
                    service.remove = service.destroyData;
                    return service;
                }
            },
            {
                key: 'makeXhr',
                value: function makeXhr(id, params, location) {
                    var type = arguments.length <= 3 || arguments[3] === undefined ? 'GET' : arguments[3];
                    location = (0, _utils.stripSlashes)(location);
                    var url = this.url + '/' + location;
                    if (id !== null && id !== undefined) {
                        url += '/' + id;
                    }
                    var contentType = 'application/x-www-form-urlencoded';
                    if (type !== 'GET') {
                        contentType = 'application/json';
                        params = JSON.stringify(params);
                    }
                    var ajaxConfig = {
                        url: url,
                        type: type,
                        contentType: contentType,
                        datatype: 'json',
                        data: params
                    };
                    var token = this.getToken();
                    if (token && window.localStorage) {
                        _$['default'].extend(ajaxConfig, { headers: { 'Authorization': 'Bearer ' + token } });
                    }
                    return _$['default'].ajax(ajaxConfig).fail(function (err) {
                        console.warn(err);
                        return err;
                    });
                }
            },
            {
                key: 'getToken',
                value: function getToken() {
                    var token = undefined;
                    if (this.storage) {
                        token = this.storage.getItem(this.tokenLocation);
                        if (!token) {
                            token = cookieStorage.getItem(this.tokenLocation);
                        }
                    }
                    return token;
                }
            },
            {
                key: 'getSession',
                value: function getSession() {
                    var session = undefined, token = undefined;
                    if (window.localStorage) {
                        token = this.getToken();
                        if (token) {
                            var tokenData = (0, _decode['default'])(token);
                            if (tokenData.exp * 1000 > new Date().getTime()) {
                                session = _$['default'].extend({}, tokenData);
                                delete session.exp;
                                delete session.iat;
                                delete session.iss;
                            }
                        }
                    }
                    return session;
                }
            },
            {
                key: 'authenticate',
                value: function authenticate(params) {
                    var _this = this;
                    var data = { type: 'token' };
                    _$['default'].extend(data, params);
                    var token = this.getToken();
                    if (token && data.type === 'token') {
                        data.token = token;
                    }
                    if (token) {
                        (function () {
                            var authenticateSocket = function authenticateSocket(data) {
                                this.io.once('unauthorized', function (res) {
                                    return console.log(res);
                                });
                                this.io.once('authenticated', function (res) {
                                    return console.log(res);
                                });
                                this.io.emit('authenticate', data);
                            };
                            if (_this.io.connected) {
                                authenticateSocket.call(_this, data);
                            } else {
                                _this.io.once('connect', function () {
                                    return authenticateSocket.call(_this, data);
                                });
                            }
                        }());
                    }
                    var location = data.type === 'token' ? this.tokenEndpoint : this.localEndpoint;
                    return this.makeXhr(null, data, location, 'POST').then(function (data) {
                        return _this.persistToken(data);
                    }).then(function (data) {
                        return _this.makeSSRCookie(data);
                    });
                }
            },
            {
                key: 'persistToken',
                value: function persistToken(data) {
                    if (this.storeToken && this.storage) {
                        this.storage.setItem(this.tokenLocation, data.token);
                    }
                    return data;
                }
            },
            {
                key: 'makeSSRCookie',
                value: function makeSSRCookie(data) {
                    if (this.ssr) {
                        var tokenExp = (0, _decode['default'])(data.token).exp, options = { expires: new Date(tokenExp * 1000) };
                        cookieStorage.setItem(this.tokenLocation, data.token, options);
                    }
                    return data;
                }
            },
            {
                key: 'logout',
                value: function logout() {
                    var _this2 = this;
                    return new Promise(function (resolve) {
                        _this2.storage.removeItem(_this2.tokenLocation);
                        cookieStorage.removeItem(_this2.tokenLocation);
                        resolve();
                    });
                }
            }
        ]);
        return Feathers;
    }();
    module.exports = Feathers;
});
/*[global-shim-end]*/
(function(){ // jshint ignore:line
	window._define = window.define;
	window.define = window.define.orig;
}
)();