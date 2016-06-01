/*can-connect-feathers@0.4.1#can-connect-feathers*/
define([
    'exports',
    'module',
    'steal-socket.io',
    'jquery',
    'cookie-storage',
    'jwt-decode',
    './utils',
    'feathers-errors'
], function (exports, module, _stealSocketIo, _jquery, _cookieStorage, _jwtDecode, _utils, _feathersErrors) {
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
    var _errors = _interopRequireDefault(_feathersErrors);
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
                    return new Promise(function (resolve, reject) {
                        _$['default'].ajax(ajaxConfig).then(resolve).fail(function (err) {
                            if (!err.responseText) {
                                return reject(err);
                            }
                            try {
                                reject(_errors['default'].convert(JSON.parse(err.responseText)));
                            } catch (e) {
                                reject(e);
                            }
                        });
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