'use strict';

// const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-legacy-authentication-hooks');

exports.before = {
  all: [],
  find: [],
  get: [],
  create: [
    auth.hashPassword()
  ],
  update: [
    auth.populateUser(),
    auth.hashPassword()
  ],
  patch: [
    auth.populateUser(),
    auth.hashPassword()
  ],
  remove: [
    auth.populateUser()
  ]
};

exports.after = {
  all: [hooks.remove('password')],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
