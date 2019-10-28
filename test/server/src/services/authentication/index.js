'use strict';

const auth = require('@feathersjs/authentication');
const local = require('@feathersjs/authentication-local');
const jwt = require('@feathersjs/authentication-jwt');

module.exports = function () {
  const app = this;

  let config = app.get('auth');

  app.configure(auth(config))
    .configure(jwt())
    .configure(local());

  app.service('authentication').hooks({
    before: {
      create: [
        // You can chain multiple strategies
        auth.hooks.authenticate(['local'])
      ]
    }
  });
};
