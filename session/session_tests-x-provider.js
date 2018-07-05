var QUnit = require('steal-qunit');
var DefineMap = require('can-define/map/');
var DefineList = require('can-define/list/');
// Behaviors
var feathersBehavior = require('../service/');
var feathersSession = require('./session');
var zoneStorage = require('./storage');
var connect = require('can-connect');
var dataParse = require('can-connect/data/parse/');
var construct = require('can-connect/constructor/');
var constructStore = require('can-connect/constructor/store/');
var constructOnce = require('can-connect/constructor/callbacks-once/');
var canMap = require('can-connect/can/map/');
var canRef = require('can-connect/can/ref/');
var dataCallbacks = require('can-connect/data/callbacks/');
var realtime = require('can-connect/real-time/');

var feathers = require('feathers/client');
var hooks = require('feathers-hooks');
var auth = require('feathers-authentication-client');
var set = require("can-set-legacy");

module.exports = function runSessionTests (options) {
	var app, Account, Session, User, session;

	QUnit.module("can-connect-feathers/session - " + options.moduleName, {
		beforeEach: function () {
			// have to run this here so rest fixtures get found
			options.fixtures();
			window.localStorage.clear();
			if (session) {
				// We need to return a promise to make sure we complete the teardown:
				return session.destroy();
			}
		}
	});

	// The following should be moved into the `beforeEach`
	// However, we need some sort of `connection.teardown()` to
	// undo our real-time event handlers on socket.io

	options.fixtures();

	app = feathers()
		.configure(options.provider() )
		.configure(hooks())
		.configure(auth());

	var behaviors = [
		feathersBehavior,
		construct,
		constructStore,
		constructOnce,
		canMap,
		canRef,
		dataParse,
		dataCallbacks,
		realtime
	];


	User = DefineMap.extend('User', {
		_id: '*',
		email: 'string'
	});

	User.List = DefineList.extend({
		'*': User
	});

	var userService = app.service('users');

	connect(behaviors, {
		feathersService: userService,
		idProp: '_id',
		Map: User,
		List: User.List,
		name: 'user',
		queryLogic: new set.Algebra(set.props.id('_id'))
	});

	Account = DefineMap.extend('Account', {
		_id: '*',
		name: 'string',
		userId: '*'
	});

	Account.List = DefineList.extend({
		'*': Account
	});

	var accountService = app.service('accounts');

	connect(behaviors, {
		feathersService: accountService,
		idProp: '_id',
		Map: Account,
		List: Account.List,
		name: 'account',
		queryLogic: new set.Algebra(set.props.id('_id'))
	});

	var sessionBehaviors = [
		feathersSession,
		dataParse,
		construct,
		constructStore,
		constructOnce,
		canMap,
		canRef,
		dataCallbacks,
		realtime
	];

	Session = DefineMap.extend('Session', {
		seal: false
	}, {
		email: 'string',
		password: 'string',
		strategy: 'string'
	});

	Session.List = DefineList.extend({
		'*': Session
	});

	Session.connection = connect(sessionBehaviors, {
		feathersClient: app,
		idProp: 'exp',
		Map: Session,
		name: 'session',
		queryLogic: new set.Algebra(set.props.id('_id'))
	});


	QUnit.test('catch promise on no auth', function (assert) {
		var done = assert.async();

		// Clear the token.
		app.logout()
		.then(function () {
			return Account.findAll({})
			.then(function (res) {
				console.log(res);
			})
			.catch(function (err) {
				assert.ok(err, 'Got an error from findAll');
				assert.equal(err.className, 'not-authenticated', 'got a not-authenticated error');
				done();
			});
		})
		.catch(function (err) {
			console.log(err);
			done();
		});
	});

	QUnit.test('authenticate without data returns error', function (assert) {
		var done = assert.async();

		// Clear the token.
		app.logout();

		session = new Session({});
		session.save()
		.then(function (res) {
			console.log('res', res);
		})
		.catch(function (err) {
			assert.equal(err.name, 'NotAuthenticated', "got back error message: "+err.name);
			done();
		});
	});

	QUnit.test('Session.get() with no token returns NotAuthenticated error', function (assert) {
		var done = assert.async();

		// Clear the token.
		app.logout();

		Session.get()
		.then(function (res) {
			console.log('res', res);
		})
		.catch(function (err) {
			assert.equal(err.name, 'NotAuthenticated', "got back error message: "+err.name);
			done();
		});
	});

	QUnit.test('Session.get() returns a token payload after logged in', function (assert) {
		var done = assert.async();

		// Clear the token.
		app.logout().then(function () {
			var user = new User({
				email: 'marshall@bitovi.com',
				password: 'L1nds3y-Stirling-R0cks!'
			});
			user.save().then(function () {
				// Make sure it works with feathers-authentication-local default properties.
				session = new Session({
					strategy: 'local',
					email: 'marshall@bitovi.com',
					password: 'L1nds3y-Stirling-R0cks!'
				});
				session.save()
				.then(function (res) {
					assert.ok(res._id, 'Got session data back');
					assert.ok(res.accessToken, 'Got full response data back');
					Session.get()
					.then(function (res) {
						assert.ok(res._id, 'Session.get returned session data');
						user.destroy().then(done);
					})
					.catch(function (err) {
						console.log(err);
					});
				})
				.catch(function (err) {
					var correctError = err.name.indexOf('NotAuthenticated') >= 0 || err.name.indexOf('BadRequest') >= 0;
					assert.ok(correctError, "got back error message: "+err.name);
					done();
				});
			});
		});
	});

	QUnit.test('authenticate type=local', function (assert) {
		var done = assert.async();

		// Create a user.
		var user = new User({
			email: 'marshall@bitovi.com',
			password: 'L1nds3y-Stirling-R0cks!'
		});
		user.save().then(function (createdUser) {
			assert.ok(createdUser instanceof User, 'created a new user');

			// Attempt to login with the user.
			session = new Session({
				strategy: 'local',
				email: user.email,
				password: user.password
			});
			session.save()
			// Handle login success.
			.then(function (newSession) {
				assert.ok(newSession, 'successfully logged in');
				assert.ok(newSession instanceof Session, 'got back a session instance');

				// Create an account for the logged in user.
				var account = new Account({
					name: 'Checking'
				});
				account.save()
				.then(function (newAccount) {
					assert.ok(newAccount, 'created an account');
					done();
				})
				.catch(function (err) {
					console.error(err);
					assert.notOk(err, "shouldn't have had a problem creating an account");
					done();
				});
			})
			// Leave this here for easier tracking if it breaks.
			.catch(function (err) {
				assert.notOk(err.name, "got back error message: "+err.name);
				done();
			});
		});
	});

	QUnit.test('authenticate type=local with 2fa style response', function (assert) {
		var done = assert.async();

		// Create a user.
		var user = new User({
			email: 'marshall@bitovi.com',
			password: 'L1nds3y-Stirling-R0cks!'
		});
		user.save().then(function (createdUser) {
			assert.ok(createdUser instanceof User, 'created a new user');

			// Attempt to login with the user.
			session = new Session({
				strategy: 'local',
				email: user.email,
				password: user.password,
				isTwoFactorAuthExample: true
			});
			session.save()
			// Handle login success.
			.then(function (response) {
				assert.ok(response, 'successfully completed first factor auth step');
				// a two factor auth response will vary depending on server implementation. We're just matching up with the fixtures.
				assert.ok(response.success, 'got back the success response');
				done();
			})
			.catch(function (err) {
				assert.notOk(err.name, "got back error message: "+err.name);
				done();
			});
		});
	});

	QUnit.test('authenticate type=token', function (assert) {
		var done = assert.async();

		// Create a user.
		var user = new User({
			email: 'marshall@bitovi.com',
			password: 'L1nds3y-Stirling-R0cks!'
		});
		user.save().then(function (createdUser) {
			assert.ok(createdUser instanceof User, 'created a new user');

			// Attempt to login with the user.
			session = new Session({
				strategy: 'local',
				email: user.email,
				password: user.password
			});
			session.save()
			// Handle login success.
			.then(function (newSession) {
				assert.ok(newSession, 'successfully logged in');
				assert.ok(newSession instanceof Session, 'got back a session instance');

				app.passport.getJWT().then(function (accessToken) {
					app.logout();

					var anotherSession = new Session({ strategy: 'jwt', accessToken: accessToken });
					anotherSession.save().then(function (newlyCreatedSession) {
						assert.ok(newlyCreatedSession, 'successfully logged in');
						assert.ok(newlyCreatedSession instanceof Session, 'got back a session instance');

						// Create an account for the logged in user.
						var account = new Account({
							name: 'Checking'
						});
						account.save()
						.then(function (newAccount) {
							assert.ok(newAccount, 'created an account');
							assert.equal(newAccount.userId, session.userId, 'the server assigned the userId correctly');
							newlyCreatedSession.destroy().then(function () {
								done();
							});
						})
						.catch(function (err) {
							assert.notOk(err, "shouldn't have had a problem creating an account");
						});
					}).catch(function (e) {
						console.log(e);
					});
				});
			})
			// Leave this here for easier tracking if it breaks.
			.catch(function (err) {
				assert.notOk(err.name, "got back error message: "+err.name);
				done();
			});
		});
	});

	QUnit.test('Session.current populates on login, clears on logout', function (assert) {
		var done = assert.async();

		new User({
			email: 'marshall@test.com',
			password: 'thisisatest'
		}).save().then(function (user) {
			assert.equal(Session.current, undefined, 'Session.current is undefined with no auth');

			var handledOnce = false;
			var handler = function (event, _session) {
				session = _session;
				assert.ok(event, 'Reading Session.current triggered the "current" event');

				if (session && !handledOnce) {
					handledOnce = true;
					assert.ok(Session.current._id, 'Session.current is now synchronously readable.');
					assert.ok(session instanceof Session, 'Session.current is a Session instance');

					Session.current.destroy();
				} else {
					Session.off('current', handler);
					assert.equal(Session.current, undefined, 'The session was successfully destroyed');
					user.destroy().then(function () {
						assert.ok('User destroyed', 'The user was cleaned up.');
						done();
					});
				}
			};

			Session.on('current', handler);

			return new Session({
				strategy: 'local',
				user: {
					email: user.email,
					password: user.password
				}
			}).save().catch(function (error) {
				console.log(error);
			});
		});
	});

	QUnit.test('Session.current populates on created event, clears on destroyed', function (assert) {
		var done = assert.async();

		new User({
			email: 'marshall@ci.com',
			password: 'thisisatest'
		}).save().then(function (user) {
			session = new Session({
				strategy: 'local',
				user: {
					email: user.email,
					password: user.password
				}
			});

			var handler = function (event, _session) {
				session = _session;
				assert.ok(event, 'Creating a session triggered the "current" event');
				if (session) {
					assert.ok(session._id, 'Session.current is now synchronously readable.');

					user.destroy().then(function () {
						assert.ok('User destroyed', 'The user was cleaned up.');

						Session.current.destroy();
					});
				} else {
					assert.ok(Session.current === undefined, 'Session.current was removed on destroyed event');
					Session.off('current', handler);
					done();
				}
			};
			Session.on('current', handler);

			session.save().then(function (sessionData) {
				console.log('sessionData', sessionData);
			})
			.catch(function (error) {
				console.log(error);
			});
		});
	});

	/*
	 * Session.current should return one of the following values:
	 * - `null` for non-authenticated (after authentication gets rejected)
	 * - `undefined` when authentication is in process
	 * - `instance` when authentication resolves
	 */
	QUnit.test('Session.current states', function(assert){
		var done = assert.async();

		assert.ok(!Session.current, 'Session.current should be null or undefined');

		var handler = function(ev, value){
			assert.ok(value === null, 'Session.current should be null for non-authenticated');
		};

		Session.bind('current', handler);

		new Session({}).save().then(function(){
			assert.ok(false, 'session save should throw an error for non-authenticated user');
			done();
		}).catch(function(){
			assert.ok(true, 'session save should throw an error for non-authenticated user');
			assert.ok(zoneStorage.getItem('can-connect-feathers-session') === null, 'zoneStorage value for session should be null');
			Session.unbind('current', handler);
			done();
		});
	});
};
