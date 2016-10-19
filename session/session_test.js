const QUnit = require('steal-qunit');
const runCrossProviderTests = require('./session_tests-x-provider');
const clearCookies = require('../test/clear-cookies');

const socketio = require('feathers-socketio/client');
const rest = require('feathers-rest/client');
const jQuery = require('jquery');
const io = require('socket.io-client/socket.io');

QUnit.module('can-connect-feathers');

// Run basic tests for the feathers-socketio provider.
clearCookies();
runCrossProviderTests({
  moduleName: 'feathers-rest',
  provider: rest('http://localhost:3333').jquery(jQuery)
});

// Run basic tests for the feathers-socketio provider.
const socket = io('http://localhost:3333', {
  transports: ['websocket']
});
const socketioProvider = socketio(socket);
clearCookies();
runCrossProviderTests({
  moduleName: 'feathers-socketio',
  provider: socketioProvider
});
