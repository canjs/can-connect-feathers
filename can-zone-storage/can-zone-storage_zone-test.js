/* global CanZone */
var QUnit = require('steal-qunit');
var zoneStorage = require('./can-zone-storage');
var Zone = require('can-zone');

QUnit.module('can-zone-storage with can-zone');

QUnit.test('Works in a Zone', function (assert) {
  var done = assert.async();
  new Zone().run(function () {
    assert.ok(CanZone.current.data.hasOwnProperty, 'CanZone.current.data is an object');

    var key = 'key';
    var val = 'Write to the CanZone.current.data store!';
    var store = zoneStorage.getStore();

    assert.ok(CanZone.current.data === store, 'getStore returns the CanZone.current.data store when inside a zone.');

    zoneStorage.setItem(key, val);
    assert.equal(CanZone.current.data[key], val, 'Data was written to CanZone.current.data store.');
    assert.equal(store[key], val, 'getStore returns the CanZone.current.data store when outside a Zone.');

    var retrievedVal = zoneStorage.getItem(key);
    assert.equal(val, retrievedVal, 'getVal properly retrieves the setVal');

    zoneStorage.removeItem(key);
    assert.equal(zoneStorage.data.hasOwnProperty(key), false, 'Data was removed from the CanZone.current.data store.');
  }).then(function () {
    done();
  });
});
