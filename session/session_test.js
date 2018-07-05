var runCrossProviderTests = require('./session_tests-x-provider');
var clearCookies = require('../test/clear-cookies');

var socketio = require('feathers-socketio/client');
var rest = require('feathers-rest/client');
var jQuery = require('jquery');
var io = require('socket.io-client/dist/socket.io');
var fixtureSocket = require('can-fixture-socket');
var fixture = require('can-fixture');
var set = require('can-set-legacy');
var errors = require('feathers-errors');


// Setup the shared fixture stuff to be used
var error = {
		"name": "NotAuthenticated",
		"message": "not-authenticated",
		"code": 401,
		"className": "not-authenticated",
		"errors": {}
	};

var userAlgebra = new set.Algebra(
		set.props.id('_id')
	),
	userStore = fixture.store([], userAlgebra);

var accountAlgebra = new set.Algebra(
		set.props.id('_id')
	),
	accountStore = fixture.store([], accountAlgebra),
	accountsHandler = function (request, response, headers) {
		if (headers.authorization || headers.Authorization) {
			if (request.method === 'post') {
				accountStore.createData(request, response);
			}
		} else {
			var error = new errors.NotAuthenticated('not-authenticated');
			return response(401, error, undefined, error.message);
		}
	};

// Authentication fixtures
var accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImV4cCI6NDQ3NjM5MjQ4MCwiaWF0IjoxNDc2MzkyNDgwLCJpc3MiOiJmZWF0aGVycyJ9.xkEOYArw8_eDQlI-Sx-ok0lD6bb3PFPGzMgF9nAaDTI';

function getUserFromStore (authData) {
	var users = userStore.getList().data;
	return users.filter(function (user) {
		return user.email === authData.email;
	})[0];
}
var authRestHandler = function (request, response) {
	var authData = request.data;
	if (authData && authData.isTwoFactorAuthExample) {
		response({success: true});
	} else if (authData && authData.email) {
		var user = getUserFromStore(authData);
		if (user) {
			document.cookie = 'feathers-jwt=' + accessToken;
			response({accessToken: accessToken});
		} else {
			var error = new errors.NotAuthenticated('not-authenticated');
			return response(401, error, undefined, error.message);
		}
	} else if (authData && authData.accessToken) {
		document.cookie = 'feathers-jwt=' + accessToken;
		response({accessToken: accessToken});
	}
};


// Run basic tests for the feathers-socketio provider.
clearCookies();
runCrossProviderTests({
	moduleName: 'feathers-rest',
	provider: function(){
		return rest('').jquery(jQuery);
	},
	fixtures: function(){
		fixture('/users', userStore);
		fixture('/accounts', accountsHandler);
		fixture('/accounts/{_id}', accountsHandler);
		fixture('/authentication', authRestHandler);
	}
});



// Run basic tests for the feathers-socketio provider.
clearCookies();
runCrossProviderTests({
	moduleName: 'feathers-socketio',
	provider: function(){
		var socket = io('', {
			transports: ['websocket']
		});
		return socketio(socket);
	},
	fixtures: function(){
		var isAuthenticated = false;

		var mockServer = new fixtureSocket.Server(io);

		mockServer.onFeathersService('users', userStore, {id: '_id'});

		mockServer.on('accounts::find', function (query, callback) {
			if (isAuthenticated) {
				fixtureSocket.requestHandlerToListener(accountStore.getListData).apply(null, arguments);
			} else {
				callback(error);
			}
		});
		mockServer.on('accounts::create', function (data, params, callback) {
			if (isAuthenticated) {
				fixtureSocket.requestHandlerToListener(accountStore.createData)(data, callback);
			} else {
				callback(error);
			}
		});

		mockServer.on('authenticate', function (request, callback) {
			function authenticatedUser () {
				isAuthenticated = true;
				document.cookie = 'feathers-jwt=' + accessToken;
				callback(null, {accessToken: accessToken});
			}
			if (request.strategy === 'jwt') {
				return authenticatedUser();
			}

			if (request.isTwoFactorAuthExample) {
				callback(null, {success: true});
			}

			var user = getUserFromStore(request);
			if (user) {
				return authenticatedUser();
			} else {
				callback(new errors.NotAuthenticated('not-authenticated'));
			}
		});
		mockServer.on('logout', function (callback) {
			isAuthenticated = false;
			callback();
		});

	}
});
