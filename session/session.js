var connect = require('can-connect');
var errors = require('feathers-errors');
var authAgent = require('feathers-authentication-popups').authAgent;
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

  var feathersClient = this.feathersClient;
  var options = feathersClient.passport.options;

  return {
    init: function () {
      var connection = this;
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
        feathersClient.authenticate({strategy: 'jwt', accessToken: token})
          .then(function (data) {
            var payload = decode(data.accessToken);
            connection.createInstance(payload);
          });
      });
    },
    createData: function (data) {
      return feathersClient.authenticate(data)
        .then(function (data) {
          return decode(data.accessToken);
        });
    },
    getData: function () {
      return new Promise(function (resolve, reject) {
        var tokenLocation = options.tokenKey || options.cookie;
        if (hasValidToken(tokenLocation) && !window.doneSsr) {
          feathersClient.authenticate()
            .then(function (data) {
              var payload = decode(data.accessToken);
              return resolve(payload);
            })
            .catch(reject);
        } else {
          reject(new errors.NotAuthenticated('Not Authenticated'));
        }
      });
    },
    destroyData: function () {
      return Promise.resolve(feathersClient.logout());
    }
  };
});
