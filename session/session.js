var connect = require('can-connect');
var errors = require('feathers-errors');

module.exports = connect.behavior('data/feathers-session', function () {
  var helpURL = 'https://v3.canjs.com/doc/can-connect-feathers.html';
  if (!this.feathersClient) {
    throw new Error('You must provide a feathersClient instance to the feathers-session behavior. See ' + helpURL);
  }
  if (!this.Map) {
    throw new Error('You must provide a Map instance to the feathers-session behavior. See ' + helpURL);
  }

  var Session = this.Map;
  var app = this.feathersClient;

  return {
    createData: function (data) {
      return new Promise(function (resolve, reject) {
        return app.authenticate(data)
          .then(app.authentication.verifyJWT)
          .then(function (payload) {
            return resolve(new Session(payload));
          })
          .catch(reject);
      });
    },
    getData: function () {
      return new Promise(function (resolve, reject) {
        app.authentication.getJWT()
        .then(function (data) {
          if (data) {
            return resolve(data);
          }
          reject(new errors.NotAuthenticated('Not Authenticated'));
        });
      });
    },
    destroyData: function () {
      return app.logout();
    }
  };
});
