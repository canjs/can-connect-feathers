import QUnit from 'steal-qunit';
import Feathers from './can-connect-feathers';
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import superMap from 'can-connect/can/super-map/';

QUnit.module('can-connect-feathers');

QUnit.test('Plugin initializes correctly', function(){
  var feathers = new Feathers({
    socketOptions: {
      reconnection: false
    }
  });
  QUnit.equal(typeof Feathers, 'function', 'Default export is a class/function.');
  QUnit.equal(feathers.idProp, 'id', 'The default idProp is "id".');
  QUnit.ok(feathers.io, 'Socket.io was initialized');
  QUnit.ok(feathers.ssr, 'SSR support is enabled by default.');
  QUnit.ok(feathers.storage._defaultOptions, 'CookieStorage is the default storage engine.');
  QUnit.ok(feathers.storeToken, 'Token is set to be stored by default.');
  QUnit.ok(feathers.allowSocketIO, 'socket.io is enabled by default.');
  QUnit.equal(feathers.localEndpoint, 'auth/local', 'Default localEndpoint is auth/local');
  QUnit.equal(feathers.tokenEndpoint, 'auth/token', 'Default tokenEndpoint is auth/token');
  QUnit.equal(feathers.tokenLocation, 'feathers-jwt', 'Default tokenLocation key is feathers-jwt');
  QUnit.equal(feathers.url, '', 'Default url is empty string');
  QUnit.equal(typeof feathers.rest, 'function', 'rest function is available.');
  QUnit.equal(typeof feathers.socketio, 'function', 'socketio function is available.');
  QUnit.equal(typeof feathers.makeXhr, 'function', 'makeXhr function is available.');
  QUnit.equal(typeof feathers.getToken, 'function', 'getToken function is available.');
  QUnit.equal(typeof feathers.getSession, 'function', 'getSession function is available.');
  QUnit.equal(typeof feathers.authenticate, 'function', 'authenticate function is available.');
  QUnit.equal(typeof feathers.persistToken, 'function', 'persistToken function is available.');
  QUnit.equal(typeof feathers.makeSSRCookie, 'function', 'makeSSRCookie function is available.');
  QUnit.equal(typeof feathers.logout, 'function', 'logout function is available.');
});

QUnit.module('Basic REST Integration', {
  beforeEach(){
    localStorage.clear();
  }
}, function(){

  var feathers = new Feathers({
    url: 'http://localhost:3333',
    idProp: '_id',
    socketOptions:{
      transports: ['websocket']
    }
  });
  var Message = DefineMap.extend({
    _id: '*',
    text: 'string'
  });

  Message.List = DefineList.extend({
    '*': Message
  });

  var messageConnection = superMap({
    url: feathers.rest('messages'), // Connect the instance to your model.
    idProp: '_id',
    Map: Message,
    List: Message.List,
    name: 'message'
  });

  // Connect to realtime events.
  feathers.io.on('messages created', message => messageConnection.createInstance(message));
  feathers.io.on('messages updated', message => messageConnection.updateInstance(message));
  feathers.io.on('messages patched', message => messageConnection.updateInstance(message));
  feathers.io.on('messages removed', message => messageConnection.destroyInstance(message));

  QUnit.test('findAll', function(assert){
    var done = assert.async();

    Message.findAll({}).then(messages => {
      assert.ok(messages, 'Got a response from findAll');
      assert.equal(messages instanceof Message.List, true, 'got a Message.List back');
      done();
    });
  });

  QUnit.test('findOne', function(assert){
    var done = assert.async();

    var message = new Message({
      text: 'Hi there!'
    });
    message.save().then(function(msg){
      var id = msg._id;
      // Make sure the message was deleted.
      Message.findOne(id).then(function(findResponse){
        assert.deepEqual(msg, findResponse, 'got same instance in find');
        done();
      });
    });
  });

  QUnit.test('create', function(assert){
    var done = assert.async();
    var message = new Message({
      text: 'Hi there!'
    });
    message.save().then(function(msg){
      assert.ok(msg);
      done();
    });
  });

  QUnit.test('update', function(assert){
    var done = assert.async();

    var message = new Message({
      text: 'Hi there!'
    });
    message.save().then(function(msg){
      msg.text = 'Hello!';
      // Make sure the message was deleted.
      msg.save().then(function(saveResponse){
        assert.equal(saveResponse.text, 'Hello!', 'message text updated correctly');
        done();
      });
    });
  });

  QUnit.test('delete', function(assert){
    var done = assert.async();

    var message = new Message({
      text: 'Hi there!'
    });
    message.save().then(function(msg){
      var id = msg._id;
      msg.destroy().then(function(res){
        assert.equal(res._id, id, 'deleted the instance');
        // Make sure the message was deleted.
        Message.findOne(id).catch(function(err){
          assert.ok(err, 'no record was found');
          done();
        });
      });
    });
  });
});


QUnit.module('Basic Socket.io Integration', {
  beforeEach(){
    localStorage.clear();
  }
}, function(){

  var feathers = new Feathers({
    url: 'http://localhost:3333',
    idProp: '_id',
    socketOptions:{
      transports: ['websocket']
    }
  });
  var Message = DefineMap.extend({
    _id: '*',
    text: 'string'
  });

  Message.List = DefineList.extend({
    '*': Message
  });

  var messageConnection = superMap({
    url: feathers.socketio('messages'), // Connect the instance to your model.
    idProp: '_id',
    Map: Message,
    List: Message.List,
    name: 'message'
  });

  // Connect to realtime events.
  feathers.io.on('messages created', message => messageConnection.createInstance(message));
  feathers.io.on('messages updated', message => messageConnection.updateInstance(message));
  feathers.io.on('messages patched', message => messageConnection.updateInstance(message));
  feathers.io.on('messages removed', message => messageConnection.destroyInstance(message));

  QUnit.test('findAll', function(assert){
    var done = assert.async();

    Message.findAll({}).then(messages => {
      assert.ok(messages, 'Got a response from findAll');
      assert.equal(messages instanceof Message.List, true, 'got a Message.List back');
      done();
    });
  });

  QUnit.test('findOne', function(assert){
    var done = assert.async();

    var message = new Message({
      text: 'Hi there!'
    });
    message.save().then(function(msg){
      var id = msg._id;
      // Make sure the message was deleted.
      Message.findOne(id).then(function(findResponse){
        assert.deepEqual(msg, findResponse, 'got same instance in find');
        done();
      });
    });
  });

  QUnit.test('create', function(assert){
    var done = assert.async();
    var message = new Message({
      text: 'Hi there!'
    });
    message.save().then(function(msg){
      assert.ok(msg);
      done();
    });
  });

  QUnit.test('update', function(assert){
    var done = assert.async();

    var message = new Message({
      text: 'Hi there!'
    });
    message.save().then(function(msg){
      msg.text = 'Hello!';
      // Make sure the message was deleted.
      msg.save().then(function(saveResponse){
        assert.equal(saveResponse.text, 'Hello!', 'message text updated correctly');
        done();
      });
    });
  });

  QUnit.test('delete', function(assert){
    var done = assert.async();

    var message = new Message({
      text: 'Hi there!'
    });
    message.save().then(function(msg){
      var id = msg._id;
      msg.destroy().then(function(res){
        assert.equal(res._id, id, 'deleted the instance');
        // Make sure the message was deleted.
        Message.findOne(id).catch(function(err){
          assert.ok(err, 'no record was found');
          done();
        });
      });
    });
  });
});
