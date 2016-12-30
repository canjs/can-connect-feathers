'use strict';
const accounts = require('./accounts');
const messages = require('./messages');
const authentication = require('./authentication');
const user = require('./user');

module.exports = function () {
  const app = this;

  app.configure(authentication);
  app.configure(user);
  app.configure(messages);
  app.configure(accounts);
};
