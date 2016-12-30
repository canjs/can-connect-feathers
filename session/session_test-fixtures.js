var fixtureSocket = require('can-fixture-socket');
var fixture = require('can-fixture');
var set = require('can-set');
var errors = require('feathers-errors');

module.exports = function (io) {
	var mockServer = new fixtureSocket.Server(io);
	var isAuthenticated = false;

	// Messages fixtures
	var messageAlgebra = new set.Algebra(
		set.props.id('_id')
	);
	var messageStore = fixture.store([], messageAlgebra);
	fixture('/messages', messageStore);
	fixture('/messages/{_id}', messageStore);
	// Messages socket fixtures
	mockServer.onFeathersService('messages', messageStore, {id: '_id'});

	// Users fixtures
	var userAlgebra = new set.Algebra(
		set.props.id('_id')
	);
	var userStore = fixture.store([], userAlgebra);
	fixture('/users', userStore);
	fixture('/users/{_id}', userStore);
	// Users socket fixtures.
	mockServer.onFeathersService('users', userStore, {id: '_id'});

	// Accounts fixtures
	var accountAlgebra = new set.Algebra(
		set.props.id('_id')
	);
	var accountStore = fixture.store([], accountAlgebra);
	var accountsHandler = function (request, response, headers, ajaxSettings) {
		if (headers.authorization) {
			if (request.method === 'post') {
				accountStore.create(request, response);
			}
		} else {
			var error = new errors.NotAuthenticated('not-authenticated');
			return response(401, error, undefined, error.message);
		}
	};
	fixture('/accounts', accountsHandler);
	fixture('/accounts/{_id}', accountsHandler);

	// Accounts socket fixtures
	mockServer.on('accounts::find', function (query, callback) {
		if (isAuthenticated) {
			fixtureSocket.requestHandlerToListener(accountStore.getList).apply(null, arguments);
		} else {
			callback(new errors.NotAuthenticated('not-authenticated'));
		}
	});
	mockServer.on('accounts::create', function (data, params, callback) {
		if (isAuthenticated) {
			fixtureSocket.requestHandlerToListener(accountStore.create)(data, callback);
		} else {
			callback(new errors.NotAuthenticated('not-authenticated'));
		}
	});

	// Authentication fixtures
	var accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImV4cCI6NDQ3NjM5MjQ4MCwiaWF0IjoxNDc2MzkyNDgwLCJpc3MiOiJmZWF0aGVycyJ9.xkEOYArw8_eDQlI-Sx-ok0lD6bb3PFPGzMgF9nAaDTI';

	function getUserFromStore (authData) {
		var users = userStore.getList().data;
		return users.filter(user => user.email === authData.email)[0];
	}
	var authRestHandler = function (request, response, headers, ajaxSettings) {
		var authData = request.data;
		if (authData && authData.email) {
			var user = getUserFromStore(authData);
			if (user) {
				document.cookie = 'feathers-jwt=' + accessToken;
				response({accessToken});
			} else {
				var error = new errors.NotAuthenticated('not-authenticated');
				return response(401, error, undefined, error.message);
			}
		} else if (authData && authData.accessToken) {
			document.cookie = 'feathers-jwt=' + accessToken;
			response({accessToken});
		}
	};
	fixture('/authentication', authRestHandler);

	// Authentication socket fixtures.
	mockServer.on('authenticate', function (request, callback) {
		function authenticatedUser () {
			isAuthenticated = true;
			document.cookie = 'feathers-jwt=' + accessToken;
			callback(null, {accessToken});
		}
		if (request.strategy === 'jwt') {
			return authenticatedUser();
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
};
