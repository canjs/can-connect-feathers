var connect = require('can-connect');
var errors = require('feathers-errors');
var authAgent = require('feathers-authentication-popups').authAgent;
var canEvent = require('can-event');
var decode = require('jwt-decode');
var payloadIsValid = require('../utils').payloadIsValid;
var hasValidToken = require('../utils').hasValidToken;

module.exports = connect.behavior('data/feathers-session', function () {
  var helpURL = 'https://canjs.com/doc/can-connect-feathers.html';
  if (!this.feathersClient) {
    throw new Error('You must provide a feathersClient instance to the feathers-session behavior. See ' + helpURL);
  }
  if (!this.Map) {
    throw new Error('You must provide a Map instance to the feathers-session behavior. See ' + helpURL);
  }

  var Session = this.Map;
  var feathersClient = this.feathersClient;

  Object.assign(Session, canEvent);

  function makeSession (connection, payload) {
    var session = new Session(payload);
    connection.createInstance(session);
    return session;
  }

  return {
    init: function () {
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
        feathersClient.authenticate({strategy: 'jwt', token: token})
          .then(function (data) {
            var payload = decode(data.accessToken);
            return makeSession(self, payload);
          });
      });
    },
    createData: function (data) {
      var self = this;
      return feathersClient.authenticate(data)
        .then(function (data) {
          var payload = decode(data.accessToken);
          return makeSession(self, payload);
        });
    },
    getData: function () {
      var self = this;
      return new Promise(function (resolve, reject) {
        var options = feathersClient.passport.options;
        var tokenLocation = options.tokenKey || options.cookie;
        if (hasValidToken(tokenLocation) && !window.doneSsr) {
          feathersClient.authenticate()
            .then(feathersClient.passport.verifyJWT)
            .then(function (payload) {
              return resolve(makeSession(self, payload));
            })
            .catch(reject);
        } else {
          reject(new errors.NotAuthenticated('Not Authenticated'));
        }
      });
    },
    destroyData: function () {
      return feathersClient.logout();
    }
  };
});
