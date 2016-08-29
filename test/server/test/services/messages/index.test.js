'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('messages service', function() {
  it('registered the messages service', () => {
    assert.ok(app.service('messages'));
  });
});
