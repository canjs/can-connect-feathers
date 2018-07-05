"use strict";
var decode = require('jwt-decode');
var assign = require('can-assign');

// Reads and returns the contents of a cookie with the provided name.
function readCookie (name) {
	var nameEQ = name + '=';
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) === ' ') {
			c = c.substring(1, c.length);
		}
		if (c.indexOf(nameEQ) === 0) {
			return c.substring(nameEQ.length, c.length);
		}
	}
	return null;
}

// Reads the token from a cookie, sessionStorage, or localStorage, in that order.
function getStoredToken (storageLocation) {
	var token = readCookie(storageLocation);
	if (!token && (window && window.localStorage || window.sessionStorage)) {
		token = window.sessionStorage.getItem(storageLocation) || window.localStorage.getItem(storageLocation);
	}
	return token;
}

// Pass a decoded payload and it will return a boolean based on if it hasn't expired.
function payloadIsValid (payload) {
	return payload && payload.exp * 1000 > new Date().getTime();
}

// Gets a stored token and returns a boolean of whether it was valid.
function hasValidToken (storageLocation) {
	var token = getStoredToken(storageLocation);
	if (token) {
		try {
			var payload = decode(token);
			return payloadIsValid(payload);
		} catch (error) {
			return false;
		}
	}
	return false;
}

function convertLocalAuthData (originalData) {
	var data = assign({}, originalData);
	if (data && data.strategy === 'local' && data.user) {
		Object.keys(data.user).forEach(function (key) {
			data[key] = data.user[key];
		});
		delete data.user;
	}
	return data;
}

module.exports = {
	readCookie: readCookie,
	getStoredToken: getStoredToken,
	hasValidToken: hasValidToken,
	payloadIsValid: payloadIsValid,
	convertLocalAuthData: convertLocalAuthData
};
