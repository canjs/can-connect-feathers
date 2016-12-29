var QUnit = require('steal-qunit');
var zoneStorage = require('./can-zone-storage');

QUnit.module('can-zone-storage without can-zone');

QUnit.test('Basic read/write', function (assert) {
  var key = 'key';
  var val = 'Write to the internal data store!';
  var store = zoneStorage.getStore();

  assert.equal(zoneStorage.data, store, 'getStore returns the internal data store when outside a Zone.');

  zoneStorage.setItem(key, val);
  assert.equal(zoneStorage.data[key], val, 'Data was written to internal data store.');
  assert.equal(store[key], val, 'getStore returns the internal data store when outside a Zone.');

  var retrievedVal = zoneStorage.getItem(key);
  assert.equal(val, retrievedVal, 'getVal properly retrieves the setVal');

  zoneStorage.removeItem(key);
  assert.equal(zoneStorage.data.hasOwnProperty(key), false, 'Data was removed from the internal data store.');
});
