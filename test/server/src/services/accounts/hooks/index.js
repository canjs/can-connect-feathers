'use strict';

// const globalHooks = require('../../../hooks');
const newAuth = require('@feathersjs/authentication');
const auth = require('feathers-legacy-authentication-hooks');

exports.before = {
  all: [
    newAuth.hooks.authenticate('jwt'),
    hook => {
      if (!hook.params.authenticated) {
        throw new Error('Not authenticated');
      }
    }
  ],
  find: [],
  get: [],
  create: [
    auth.associateCurrentUser({ idField: '_id', as: 'userId' })
  ],
  update: [],
  patch: [],
  remove: []
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
