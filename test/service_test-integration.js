var QUnit = require('steal-qunit');
var runCrossProviderTests = require('../service/service_tests-x-provider');
var clearCookies = require('./clear-cookies');

var socketio = require('feathers-socketio/client');
var rest = require('feathers-rest/client');
var jQuery = require('jquery');
var io = require('socket.io-client/dist/socket.io');

QUnit.module('can-connect-feathers/service');

// Run basic tests for the feathers-socketio provider.
clearCookies();
runCrossProviderTests({
  moduleName: 'feathers-rest',
  provider: rest('http://localhost:3333').jquery(jQuery)
});

// Run basic tests for the feathers-socketio provider.
var socket = io('http://localhost:3333', {
  transports: ['websocket']
});
var socketioProvider = socketio(socket);
clearCookies();
runCrossProviderTests({
  moduleName: 'feathers-socketio',
  provider: socketioProvider
});
