var connect = require('can-connect');
var errors = require('feathers-errors');

module.exports = connect.behavior('data/feathers-session', function () {
  var helpURL = 'http://canjs.github.io/canjs/doc/can-connect-feathers.html';
  if (!this.feathersApp) {
    throw new Error('You must provide a feathersApp instance to the feathersSession behavior. See ' + helpURL);
  }
  if (!this.Map) {
    throw new Error('You must provide a Map instance to the feathersSession behavior. See ' + helpURL);
  }

  var Session = this.Map;
  var app = this.feathersApp;

  return {
    createData: function(data) {
      return new Promise(function (resolve, reject) {
        return app.authenticate(data)
          .then(app.authentication.verifyJWT)
          .then(function (payload) {
            return resolve(new Session(payload));
          })
          .catch(reject);
      });
    },
    getData: function() {
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
    destroyData: function() {
      return app.logout();
    }
  };
});
