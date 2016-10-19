const connect = require('can-connect');

module.exports = connect.behavior('data/feathers-session', function () {
  let helpURL = 'http://canjs.github.io/canjs/doc/can-connect-feathers.html';
  if (!this.feathersApp) {
    throw new Error('You must provide a feathersApp instance to the feathersSession behavior. See ' + helpURL);
  }

  const Session = this.Map;
  const app = this.feathersApp;

  return {
    createData (data) {
      return new Promise((resolve, reject) => {
        return app.authenticate(data)
          .then(app.authentication.verifyJWT)
          .then(payload => resolve(new Session(payload)))
          .catch(reject);
      });
    },
    destroyData () {
      return app.logout();
    }
  };
});
