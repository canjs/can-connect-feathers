var QUnit = require('steal-qunit');
var decode = require('jwt-decode');
var readCookie = require('./utils').readCookie;
var getStoredToken = require('./utils').getStoredToken;
var payloadIsValid = require('./utils').payloadIsValid;
var hasValidToken = require('./utils').hasValidToken;

var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwIjo5NDc2MzkyNDgwLCJpYXQiOjE0NzYzOTI0ODAsImlzcyI6ImZlYXRoZXJzIn0.EzmokNutNr98ULGl1sr12OYAAEoZ9ZTl1dTWTQiA7Ro';

var expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwIjo0NzYzOTI0ODAsImlhdCI6MTQ3NjM5MjQ4MCwiaXNzIjoiZmVhdGhlcnMifQ.nlvKR9cBuWOuPl7hXzdM7N8JH1n86IuL1WaJverAoFk';

QUnit.module('can-connect-feathers/utils');

QUnit.test('readCookie', function (assert) {
  document.cookie = 'feathers-jwt=' + token;
  var cookieContents = readCookie('feathers-jwt');
  assert.equal(cookieContents, token, 'Got the token from the cookie.');
});

QUnit.test('getStoredToken from sessionStorage', function (assert) {
  window.sessionStorage.setItem('feathers-jwt', token);
  var storedToken = getStoredToken('feathers-jwt');
  assert.equal(storedToken, token, 'Got the token back from sessionStorage');
  window.sessionStorage.removeItem('feathers-jwt');
});

QUnit.test('getStoredToken from localStorage', function (assert) {
  window.localStorage.setItem('feathers-jwt', token);
  var storedToken = getStoredToken('feathers-jwt');
  assert.equal(storedToken, token, 'Got the token back from localStorage');
  window.localStorage.removeItem('feathers-jwt');
});

QUnit.test('payloadIsValid', function (assert) {
  var validPayload = decode(token);
  var expiredPayload = decode(expiredToken);
  assert.equal(payloadIsValid(validPayload), true, 'Non-expired token is valid.');
  assert.equal(payloadIsValid(expiredPayload), false, 'Expired token is invalid.');
});

QUnit.test('hasValidToken', function (assert) {
  document.cookie = 'feathers-jwt=' + expiredToken;
  assert.equal(hasValidToken('feathers-jwt'), false, 'expired token was invalid.');

  document.cookie = 'feathers-jwt=' + token;
  assert.equal(hasValidToken('feathers-jwt'), true, 'non-expired token was valid.');

  document.cookie = 'feathers-jwt=';
});
