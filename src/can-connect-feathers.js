/* global window */

import io from 'steal-socket.io';
import $ from 'jquery';
import {CookieStorage} from 'cookie-storage';
import decode from 'jwt-decode';
import {stripSlashes} from './utils';
import {addAliases} from './utils';
import {isEmptyObject} from './utils';
import errors from 'feathers-errors';
import query from 'qs';

const cookieStorage = new CookieStorage();

class Feathers {
  constructor(config){
    let defaults = {
      // The current server is assumed to be the API server.
      url: '',
      // Determines if the token is persisted to the `storage` provider.
      storeToken: true,
      // The storage engine used to persist the token on the client.
      storage: cookieStorage,
      // The key name of the location where the token will be stored.
      tokenLocation: 'feathers-jwt',
      // The default `idProp` for all services.
      idProp: 'id',
      // The endpoint for token authentication.
      tokenEndpoint: 'auth/token',
      // The endpoint for username/password authentication.
      localEndpoint: 'auth/local',
      // Store the token in a cookie for SSR by default.
      ssr: true,
      // Set to false to disable socketio and force any socketio services to use rest.
      allowSocketIO: true,
      // socket.io connection options
      socketOptions: {}
    };
    $.extend(this, defaults, config);

    // Make sure the SSR server never attempts anything with sockets.
    if (window.doneSsr) {
      this.allowSocketIO = false;
    }

    if(this.allowSocketIO) {
      this.connectSocket();

    // Without this, temporarily turning off auth will break listening to
    // real-time events like `feathers.io.on`, `once`, and `off`.
    } else {
      var noOp = function(){};
      this.io = {
        on: noOp,
        once: noOp,
        off: noOp
      };
    }
  }

  /**
   * `connectSocket` provides a promise for other methods to watch.  It helps
   * make sure that requests don't get sent over socket.io until the socket
   * has fully connected.  Otherwise, requests get lost.
   */
  connectSocket(){
    this.ioConnected = new Promise((resolve, reject) => {
      this.io = io(this.url, this.socketOptions);
      this.io.once('connect', resolve);
      this.io.once('error', reject);
    });
  }

  makeUrl(location, params, id, type) {
    location = stripSlashes(location);
    params = params || {};
    let url = `${this.url}/${location}`;

    // If there's a plain id, append it to the url.
    if (id !== null && id !== undefined) {
      url += `/${id}`;

    // If the id is in the params, do the same.
    } else if (params[this.idProp]) {
      url += `/${params[this.idProp]}`;
      // remove the id from params so it's not passed as a query string.
      delete params[this.idProp];
    }

    if(Object.keys(params).length !== 0 && type === 'GET') {
      url += '?' + query.stringify(params);
    }

    return url;
  }

  /**
   * A utility to create an Ajax request with the Feathers JWT token. It
   * automatically includes the JWT token if it's available.
   */
  makeXhr(id, params, location, type = 'GET'){
    let url = this.makeUrl(location, params, id, type);
    let ajaxConfig = {
      url,
      type,
      dataType: 'json'
    };

    if (type !== 'GET') {
      ajaxConfig.contentType = 'application/json';
    }

    if (type !== 'DELETE' && type !== 'GET' && !isEmptyObject(params)) {
    	$.extend(ajaxConfig, {
    		data: JSON.stringify(params)
    	});
    }

    // Add the Authorization header if a token is available.
    let token = this.getToken();
    if (token) {
      $.extend(ajaxConfig, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
    }

    return new Promise((resolve, reject) => {
      $.ajax(ajaxConfig)
        .then(resolve)
        .fail(function(err) {
          if(!err.responseText) {
            return reject(err);
          }

          try {
            reject(errors.convert(JSON.parse(err.responseText)));
          } catch(e) {
            reject(e);
          }
        });
    });
  }

  /**
   * `rest` is a utility function to hook up can-connect's url behavior to
   * a Feathers service.  An `idProp` can be provided if a service uses a
   * different `idProp` than the default.  The Feathers service methods are
   * aliased to make it possible to use either Feathers' or can-connect's
   * method names, when being used individually.
   */
  rest(location, idProp){
    let self = this;
    idProp = idProp || this.idProp;
    let service = {
      getListData(params){
        return self.makeXhr(null, params, location);
      },
      getData(params){
        // If params is a primitive, it's the id and params = {}.
        let id = null;
        if (typeof params === 'string' || typeof params === 'number') {
          id = params;
          params = {};
        }
        return self.makeXhr(id, params, location);
      },
      createData(data){
        return self.makeXhr(null, data, location, 'POST');
      },
      updateData(data){
        return self.makeXhr(data[idProp], data, location, 'PUT');
      },
      patchData(data){
        return self.makeXhr(data[idProp], data, location, 'PATCH');
      },
      destroyData(data){
        return self.makeXhr(data[idProp], data, location, 'DELETE');
      }
    };
    service = addAliases(service);
    return service;
  }

  /**
   * `socketio` is a utility function to hook up can-connect's url behavior to
   * a Feathers service using socket.io.  An `idProp` can be provided if a
   * service uses a different `idProp` than the default.  The Feathers service
   * methods are aliased to make it possible to use either Feathers' or can-connect's
   * method names, when being used individually.
   */
  socketio(location, idProp){
    // If on the SSR server, use the rest adapter.
    if (this.allowSocketIO === false) {
      return this.rest(location, idProp);
    }

    var token = this.getToken();
    let self = this;
    idProp = idProp || this.idProp;
    let service = {
      getListData(params){
        return new Promise((resolve, reject) => {
          self.ioConnected.then(() => {
            var executeAction = function() {
              self.io.emit(`${location}::find`, params, (error, data) => {
                if (error) {
                  return reject(error);
                }
                return resolve(data);
              });
            };
            if (token) {
              self.authenticateSocket({ token: token }).then(executeAction);
            } else {
              executeAction();
            }
          });
        });
      },
      getData(params){
        return new Promise((resolve, reject) => {
          self.ioConnected.then(() => {
            // If params is a primitive, it's the id and params = {}.
            let id = null;
            if (typeof params === 'string' || typeof params === 'number') {
              id = params;
              params = {};
            }
            var executeAction = function() {
              self.io.emit(`${location}::get`, id, params, (error, data) => {
                if (error) {
                  return reject(error);
                }
                return resolve(data);
              });
            };
            if (token) {
              self.authenticateSocket({ token: token }).then(executeAction);
            } else {
              executeAction();
            }
          });
        });
      },
      createData(data){
        return new Promise((resolve, reject) => {
          self.ioConnected.then(() => {
            var executeAction = function() {
              self.io.emit(`${location}::create`, data, (error, data) => {
                if (error) {
                  return reject(error);
                }
                return resolve(data);
              });
            };
            if (token) {
              self.authenticateSocket({ token: token }).then(executeAction);
            } else {
              executeAction();
            }
          });
        });
      },
      updateData(data){
        return new Promise((resolve, reject) => {
          self.ioConnected.then(() => {
            var executeAction = function() {
              self.io.emit(`${location}::update`, data[idProp], data, (error, data) => {
                if (error) {
                  return reject(error);
                }
                return resolve(data);
              });
            };
            if (token) {
              self.authenticateSocket({ token: token }).then(executeAction);
            } else {
              executeAction();
            }
          });
        });
      },
      patchData(data){
        return new Promise((resolve, reject) => {
          self.ioConnected.then(() => {
            var executeAction = function() {
              self.io.emit(`${location}::patch`, data[idProp], data, (error, data) => {
                if (error) {
                  return reject(error);
                }
                return resolve(data);
              });
            };
            if (token) {
              self.authenticateSocket({ token: token }).then(executeAction);
            } else {
              executeAction();
            }
          });
        });
      },
      destroyData(data){
        return new Promise((resolve, reject) => {
          self.ioConnected.then(() => {
            var executeAction = function() {
              self.io.emit(`${location}::remove`, data[idProp], {}, (error, data) => {
                if (error) {
                  return reject(error);
                }
                return resolve(data);
              });
            };
            if (token) {
              self.authenticateSocket({ token: token }).then(executeAction);
            } else {
              executeAction();
            }
          });
        });
      }
    };
    service = addAliases(service);
    return service;
  }

  /**
   * Pulls the token from the storage provider, or cookieStorage.
   */
  getToken(){
    let token;
    if (this.storage) {
      token = this.storage.getItem(this.tokenLocation);
    }
    if (!token) {
      token = cookieStorage.getItem(this.tokenLocation);
    }
    return token;
  }

  /**
   * Pulls the user data from a JWT token. Browser only. If another storage
   * engine was provided, it falls back to checking cookieStorage if a token
   * wasn't found on the primary storage engine.
   */
  getSession(){
    let session, token = this.getToken();
    if (token) {
      let tokenData = decode(token);
      if (tokenData.exp * 1000 > new Date().getTime()) {
        session = $.extend({}, tokenData);
        delete session.exp;
        delete session.iat;
        delete session.iss;
      }
    }
    return session;
  }

  prepareAuthParams(params){
    let data = {
      type: 'token'
    };
    $.extend(data, params);

    // If the request type is 'token' and we have a token, add it to the data.
    let token = this.getToken();
    if (token && data.type === 'token') {
      data.token = token;
    }
    return data;
  }

  /**
   * Authenticates the user using either the `tokenEndpoint` or the
   * `localEndpoint`. It then runs the `persistToken` and `makeSSRCookie`
   * functions with the response.
   */
  authenticate(params){
    let data = this.prepareAuthParams(params),
      location = data.type === 'token' ? this.tokenEndpoint : this.localEndpoint,
      authPromise;

    // Authenticate over socket.io or Xhr.
    if (this.allowSocketIO) {
      authPromise = this.authenticateSocket(params);
    } else {
      authPromise = this.makeXhr(null, data, location, 'POST');
    }

    return authPromise
      .then(data => this.persistToken(data))
      .then(data => this.makeSSRCookie(data));
  }

  /**
   * Authenticates the socket. While it can be called directly, it's safer
   * to use the `authenticate` method, which wraps this if socket.io is
   * available.
   */
  authenticateSocket(params){
    let data = this.prepareAuthParams(params);

    return new Promise((resolve, reject) => {
      let sendSocketAuthRequest = function(data){
        this.io.once('authenticated', res => {
          // If the socket is disconnected, reconnect.
          if (!this._reconnectsHandled) {
            this.handleSocketReconnects(data);
            this._reconnectsHandled = true;
          }
          resolve(res);
        });
        this.io.once('unauthorized', res => {
          reject(res);
        });
        this.io.emit('authenticate', data);
      };

      // If the socket is connected, authenticate right away.
      if (this.io.connected) {
        sendSocketAuthRequest.call(this, data);

      // Otherwise, authenticate once it connects.
      } else {
        this.io.once('connect', () => sendSocketAuthRequest.call(this, data));
      }
    });
  }

  /**
   * When the socket gets disconnected, this makes sure that it re-authenticates
   * upon reconnection. It simply calls `authenticateSocket` and persists
   * the token.
   */
  handleSocketReconnects(data){
    // Make sure the socket re-authenticates if it gets disconnected.
    this.io.on('reconnect', () => {
      this.authenticateSocket(data)
        .then(data => this.persistToken(data))
        .then(data => this.makeSSRCookie(data));
    });
  }

  /**
   * Stores the cookie in the provided storage engine. If it's the same as
   * the cookieStorage, then the makeSSRCookie function will overwrite it
   * with the token expiration.
   */
  persistToken(data){
    if (this.storeToken && this.storage) {
      this.storage.setItem(this.tokenLocation, data.token);
    }
    return data;
  }

  /**
   * Stores the token in a cookie to be used with SSR. Can be disabled by
   * setting `ssr` in the initial configuration to `false`.
   */
  makeSSRCookie(data){
    if (this.ssr) {
      let tokenExp = decode(data.token).exp,
      options = {
        expires: new Date(tokenExp * 1000)
      };
      cookieStorage.setItem(this.tokenLocation, data.token, options);
    }
    return data;
  }

  /**
   * Logout removes the token from the storage engine(s).  It returns
   * a resolved promise. If socket.io is enabled, it forces the socket to
   * reconnect unauthenticated.
   */
  logout(data){
    return new Promise(resolve => {
      this.storage.removeItem(this.tokenLocation);
      cookieStorage.removeItem(this.tokenLocation);

      if (this.allowSocketIO) {
        // Disconnect the socket to purge auth.
        this.io.disconnect();
        this.connectSocket();
      }
      resolve(data);
    });
  }
}

export default Feathers;
