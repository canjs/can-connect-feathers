var connect = require('can-connect');
var errors = require('feathers-errors');
var authAgent = require('feathers-authentication-popups').authAgent;
var canEvent = require('can-event');
var decode = require('jwt-decode');

// Pass a decoded payload and it will return a boolean based on if it hasn't expired.
function payloadIsValid (payload) {
  return payload && payload.exp * 1000 > new Date().getTime();
}

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

  // Listen to feathers-authentication-popups messages.
  authAgent.on('login', function (token) {
    try {
      var payload = decode(token);
      if (payloadIsValid(payload)) {
        Session.connection.createInstance(payload);
        Session.trigger('created', [payload]);
      } else {
        console.log('error');
        throw new Error('invalid');
      }
    } catch (error) {
      console.log(error);
      throw new Error('An invalid token was received through the feathers-authentication-popups authAgent');
    }
  });

  return {
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
