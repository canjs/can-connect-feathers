import QUnit from 'steal-qunit';
import Feathers from './can-connect-feathers';

QUnit.module('can-connect-feathers');

QUnit.test('Initialized the plugin', function(){
  let feathers = new Feathers();
  QUnit.equal(typeof Feathers, 'function', 'Default export is a class/function.');
  QUnit.equal(feathers.idProp, 'id', 'The default idProp is "id".');
  QUnit.ok(feathers.io, 'Socket.io was initialized');
  QUnit.ok(feathers.ssr, 'SSR support is enabled by default.');
  QUnit.ok(feathers.storage._defaultOptions, 'CookieStorage is the default storage engine.');
  QUnit.ok(feathers.storeToken, 'Token is set to be stored by default.');
  QUnit.equal(feathers.localEndpoint, 'auth/local', 'Default localEndpoint is auth/local');
  QUnit.equal(feathers.tokenEndpoint, 'auth/token', 'Default tokenEndpoint is auth/token');
  QUnit.equal(feathers.tokenLocation, 'ssr-cookie', 'Default tokenLocation key is ssr-cookie');
  QUnit.equal(feathers.url, '', 'Default url is empty string');
  QUnit.equal(typeof feathers.rest, 'function', 'rest function is available.');
  QUnit.equal(typeof feathers.makeXhr, 'function', 'makeXhr function is available.');
  QUnit.equal(typeof feathers.getToken, 'function', 'getToken function is available.');
  QUnit.equal(typeof feathers.getSession, 'function', 'getSession function is available.');
  QUnit.equal(typeof feathers.authenticate, 'function', 'authenticate function is available.');
  QUnit.equal(typeof feathers.persistToken, 'function', 'persistToken function is available.');
  QUnit.equal(typeof feathers.makeSSRCookie, 'function', 'makeSSRCookie function is available.');
  QUnit.equal(typeof feathers.logout, 'function', 'logout function is available.');
});
