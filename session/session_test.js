var QUnit = require('steal-qunit');
var runCrossProviderTests = require('./session_tests-x-provider');
var clearCookies = require('../test/clear-cookies');

var socketio = require('feathers-socketio/client');
var rest = require('feathers-rest/client');
var jQuery = require('jquery');
var io = require('socket.io-client/dist/socket.io');

var setupFixtures = require('./session_test-fixtures');
setupFixtures(io);

QUnit.module('can-connect-feathers/session');

// QUnit.test('feathers-authentication-popups', function (assert) {
//   var done = assert.async();

//   assert.throws(function () {
//     window.authAgent.emit('login', 'blah');
//   },
//   /invalid token/,
//   'The authAgent handler rejected an invalid token.');

//   setTimeout(function () {
//     done();
//   }, 100);
// });

// Run basic tests for the feathers-socketio provider.
clearCookies();
runCrossProviderTests({
	moduleName: 'feathers-rest',
	provider: rest('').jquery(jQuery)
});

// Run basic tests for the feathers-socketio provider.
var socket = io('', {
	transports: ['websocket']
});
var socketioProvider = socketio(socket);
clearCookies();
runCrossProviderTests({
	moduleName: 'feathers-socketio',
	provider: socketioProvider
});
