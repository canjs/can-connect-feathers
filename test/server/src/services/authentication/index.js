'use strict';

const auth = require('feathers-authentication');
const local = require('feathers-authentication-local');
const jwt = require('feathers-authentication-jwt');

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
