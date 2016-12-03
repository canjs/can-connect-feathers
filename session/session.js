var connect = require('can-connect');
var errors = require('feathers-errors');
var authAgent = require('feathers-authentication-popups').authAgent;
var canEvent = require('can-event');
var decode = require('jwt-decode');
var payloadIsValid = require('../utils').payloadIsValid;

module.exports = connect.behavior('data/feathers-session', function () {
  var helpURL = 'https://v3.canjs.com/doc/can-connect-feathers.html';
  if (!this.feathersClient) {
    throw new Error('You must provide a feathersClient instance to the feathers-session behavior. See ' + helpURL);
  }
  if (!this.Map) {
    throw new Error('You must provide a Map instance to the feathers-session behavior. See ' + helpURL);
  }

  var Session = this.Map;
  var feathersClient = this.feathersClient;

  Object.assign(Session, canEvent);

  return {
    init: function() {
      var self = this;
      // Listen to feathers-authentication-popups messages.
      authAgent.on('login', function (token) {
        try {
          var payload = decode(token);
          if (!payloadIsValid(payload)) {
            throw new Error('invalid token');
          }
        } catch (error) {
          throw new Error('An invalid token was received through the feathers-authentication-popups authAgent');
        }
        feathersClient.authenticate({type: 'token', token: token})
          .then(function(response){
            var payload = decode(response.token);
            self.createInstance(payload);
            Session.trigger('created', [payload]);
          });
      });
    },
    createData: function (data) {
      return new Promise(function (resolve, reject) {
        return feathersClient.authenticate(data)
          .then(feathersClient.authentication.verifyJWT)
          .then(function (payload) {
            return resolve(new Session(payload));
          })
          .catch(reject);
      });
    },
    getData: function () {
      return new Promise(function (resolve, reject) {
        feathersClient.authentication.getJWT()
        .then(function (data) {
          if (data) {
            data = typeof data === 'string' ? {token: data} : data;
            return resolve(data);
          }
          reject(new errors.NotAuthenticated('Not Authenticated'));
        });
      });
    },
    destroyData: function () {
      return feathersClient.logout();
    }
  };
});
