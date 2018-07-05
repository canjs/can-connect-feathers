"use strict";
var connect = require('can-connect');
var errors = require('feathers-errors');
var authAgent = require('feathers-authentication-popups').authAgent;
var decode = require('jwt-decode');
var payloadIsValid = require('../utils/utils').payloadIsValid;
var hasValidToken = require('../utils/utils').hasValidToken;
var convertLocalAuthData = require('../utils/utils').convertLocalAuthData;
var ObservationRecorder = require('can-observation-recorder');
var zoneStorage = require('./storage');

module.exports = connect.behavior('data/feathers-session', function (base) {
	var helpURL = 'https://canjs.com/doc/can-connect-feathers.html';
	var feathersClient = this.feathersClient;

	if (!feathersClient) {
		throw new Error('You must provide a feathersClient instance to the feathers-session behavior. See ' + helpURL);
	}
	if (!this.Map) {
		throw new Error('You must provide a Map instance to the feathers-session behavior. See ' + helpURL);
	}
	if (!feathersClient.passport) {
		throw new Error('You must register the feathers-authentication-client plugin before using the feathers-session behavior. See ' + helpURL);
	}

	var options = feathersClient.passport.options;
	var Session = this.Map;

	Object.defineProperty(Session, 'current', {
		get: function () {
			ObservationRecorder.add(Session, 'current');
			if (zoneStorage.getItem('can-connect-feathers-session') === undefined) {

				// set session to `undefined` when we start authentication:
				zoneStorage.removeItem('can-connect-feathers-session');

				Session.get().then(function (session) {
					zoneStorage.setItem('can-connect-feathers-session', session);
					Session.dispatch('current', [session]);
				})
				.catch(function (error) {

					// set session to `null` since we know that user is non-authenticated:
					zoneStorage.setItem('can-connect-feathers-session', null);
					Session.dispatch('current', [null]);

					if (!error.className || error.className.indexOf('not-authenticated') < 0) {
						return Promise.reject(error);
					}
				});
			}
			return zoneStorage.getItem('can-connect-feathers-session');
		}
	});

	Session.on('created', function (ev, session) {
		zoneStorage.setItem('can-connect-feathers-session', session);
		Session.dispatch('current', [session]);
	});
	Session.on('destroyed', function () {
		zoneStorage.removeItem('can-connect-feathers-session');
		Session.dispatch('current', [undefined, zoneStorage.getItem('can-connect-feathers-session')]);
	});

	return {
		init: function () {
			base.init.apply(this, arguments);
			var connection = this;
			// Listen to feathers-authentication-popups messages.
			authAgent.on('login', function (token) {
				try {
					var payload = decode(token);
					if (!payloadIsValid(payload)) {
						throw new Error('invalid token');
					}
				} catch (error) {
					throw new Error('An invalid token was received through the feathers-authentication-popups authAgent');
				}
				feathersClient.authenticate({strategy: 'jwt', accessToken: token})
					.then(function (data) {
						var payload = decode(data.accessToken);
						connection.createInstance(payload);
					});
			});
		},
		createData: function (data) {
			var requestData = convertLocalAuthData(data);
			return feathersClient.authenticate(requestData)
				.then(function (response) {
					if (response.accessToken) {
						Object.assign(response, decode(response.accessToken));
					}
					return response;
				});
		},
		getData: function () {

			return new Promise(function (resolve, reject) {
				var tokenLocation = options.tokenKey || options.cookie;
				if (hasValidToken(tokenLocation) && !window.doneSsr) {
					feathersClient.authenticate()
						.then(function (data) {
							var payload = decode(data.accessToken);
							return resolve(payload);
						})
						.catch(reject);
				} else {
					reject(new errors.NotAuthenticated('Not Authenticated'));
				}
			});
		},
		destroyData: function (session) {
			return feathersClient.logout().then(function () {
				return session;
			});
		}
	};
});
