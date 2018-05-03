var runCrossProviderTests = require('./service_tests-x-provider');
var clearCookies = require('../test/clear-cookies');

var socketio = require('feathers-socketio/client');
var rest = require('feathers-rest/client');
var jQuery = require('jquery');
var io = require('socket.io-client/dist/socket.io');

var fixtureSocket = require('can-fixture-socket');
var mockServer = new fixtureSocket.Server(io);
var fixture = require('can-fixture');
var set = require('can-set-legacy');

// Messages fixtures
var messageAlgebra = new set.Algebra(
		set.props.id('_id')
);
var messageStore = fixture.store([], messageAlgebra);


// Run basic tests for the feathers-rest provider.
clearCookies();
runCrossProviderTests({
	moduleName: 'feathers-rest',
	provider: rest('').jquery(jQuery),
	fixtures: function(){
		fixture('/messages', messageStore);
	}
});

// Run basic tests for the feathers-socketio provider.
var socket = io('', {
	transports: ['websocket']
});
var socketioProvider = socketio(socket);
clearCookies();
runCrossProviderTests({
	moduleName: 'feathers-socketio',
	provider: socketioProvider,
	fixtures: function(){
		mockServer.onFeathersService('messages', messageStore, {id: '_id'});
	}
});
