const QUnit = require('steal-qunit');
const DefineMap = require('can-define/map/');
const DefineList = require('can-define/list/');
// Behaviors
const feathersBehavior = require('./feathers');
const connect = require('can-connect');
const dataParse = require('can-connect/data/parse/');
const construct = require('can-connect/constructor/');
const constructStore = require('can-connect/constructor/store/');
const constructOnce = require('can-connect/constructor/callbacks-once/');
const canMap = require('can-connect/can/map/');
const canRef = require('can-connect/can/ref/');
const dataCallbacks = require('can-connect/data/callbacks/');
const realtime = require('can-connect/real-time/');

const feathers = require('feathers/client');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication/client');

module.exports = function runProviderTests (options) {
  QUnit.module(`Basics: ${options.moduleName}`, {
    beforeEach () {
      window.localStorage.clear();
    }
  }, function () {
    const app = feathers()
      .configure(options.provider)
      .configure(hooks())
      .configure(auth());

    var Message = DefineMap.extend({
      _id: '*',
      text: 'string'
    });

    Message.List = DefineList.extend({
      '*': Message
    });

    var behaviors = [
      dataParse,
      construct,
      constructStore,
      constructOnce,
      canMap,
      canRef,
      dataCallbacks,
      realtime,
      feathersBehavior
    ];

    var service = app.service('messages');

    var messageConnection = connect(behaviors, {
      service, // Connect the instance to your model.
      idProp: '_id',
      Map: Message,
      List: Message.List,
      name: 'message'
    });

    // Connect to realtime events.
    service.on('created', message => messageConnection.createInstance(message));
    service.on('updated', message => messageConnection.updateInstance(message));
    service.on('patched', message => messageConnection.updateInstance(message));
    service.on('removed', message => messageConnection.destroyInstance(message));

    QUnit.test('findAll', function (assert) {
      var done = assert.async();

      Message.findAll({}).then(messages => {
        assert.ok(messages, 'Got a response from findAll');
        assert.equal(messages instanceof Message.List, true, 'got a Message.List back');
        done();
      });
    });

    QUnit.test('findOne', function (assert) {
      var done = assert.async();

      var message = new Message({
        text: 'Hi there!'
      });
      message.save().then(function (msg) {
        var id = msg._id;
        // Make sure the message was deleted.
        Message.findOne(id).then(function (findResponse) {
          assert.deepEqual(msg, findResponse, 'got same instance in find');
          done();
        });
      });
    });

    QUnit.test('create', function (assert) {
      var done = assert.async();
      var message = new Message({
        text: 'Hi there!'
      });
      message.save().then(function (msg) {
        assert.ok(msg);
        done();
      });
    });

    QUnit.test('update', function (assert) {
      var done = assert.async();

      var message = new Message({
        text: 'Hi there!'
      });
      message.save().then(function (msg) {
        msg.text = 'Hello!';
        window.localStorage.clear();
        // Make sure the message was deleted.
        msg.save().then(function (saveResponse) {
          assert.equal(saveResponse.text, 'Hello!', 'message text updated correctly');
          done();
        });
      });
    });

    QUnit.test('delete', function (assert) {
      var done = assert.async();

      var message = new Message({
        text: 'Hi there!'
      });
      message.save().then(function (msg) {
        var id = msg._id;
        msg.destroy().then(function (res) {
          assert.equal(res._id, id, 'deleted the instance');
          // Make sure the message was deleted.
          Message.findOne(id).catch(function (err) {
            assert.ok(err, 'no record was found');
            done();
          });
        });
      });
    });
  });
};
