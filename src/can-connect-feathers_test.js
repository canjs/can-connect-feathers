import QUnit from 'steal-qunit';
import Feathers from './can-connect-feathers';
import $ from 'jquery';
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import superMap from 'can-connect/can/super-map/';
import connect from 'can-connect';
import dataUrl from 'can-connect/data/url/';
import dataParse from 'can-connect/data/parse/';
import construct from 'can-connect/constructor/';
import constructStore from 'can-connect/constructor/store/';
import constructOnce from 'can-connect/constructor/callbacks-once/';
import canMap from 'can-connect/can/map/';
import canRef from 'can-connect/can/ref/';
import dataCallbacks from 'can-connect/data/callbacks/';
import realtime from 'can-connect/real-time/';

// Clear all cookies
var cookies = document.cookie.split(";");

for (var i = 0; i < cookies.length; i++) {
  var cookie = cookies[i];
  var eqPos = cookie.indexOf("=");
  var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
  document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

QUnit.module('can-connect-feathers');

QUnit.test('Plugin initializes correctly', function(){
  var feathers = new Feathers({
    socketOptions: {
      reconnection: false
    },
    jquery: $
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
    },
    jquery: $
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
      localStorage.clear();
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
    },
    jquery: $
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


QUnit.module('REST Auth Integration', {
  beforeEach(){
    localStorage.clear();
  }
}, function(){

  var feathers = new Feathers({
    url: 'http://localhost:3333',
    idProp: '_id',
    allowSocketIO: false,
    jquery: $
  });
  var Message = DefineMap.extend('Message', {
    _id: '*',
    text: 'string'
  });

  Message.List = DefineList.extend({
    '*': Message
  });

  const messageConnection = superMap({
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


  var User = DefineMap.extend({
    _id: '*',
    email: 'string'
  });

  User.List = DefineList.extend({
    '*': User
  });

  superMap({
    url: feathers.rest('users'), // Connect the instance to your model.
    idProp: '_id',
    Map: User,
    List: User.List,
    name: 'user'
  });

  var Account = DefineMap.extend('Account', {
    _id: '*',
    name: 'string',
    userId: '*'
  });

  Account.List = DefineList.extend({
    '*': Account
  });

  superMap({
    url: feathers.rest('accounts'), // Connect the instance to your model.
    idProp: '_id',
    Map: Account,
    List: Account.List,
    name: 'account'
  });

  var behaviors = [
    dataUrl,
    dataParse,
    construct,
    constructStore,
    constructOnce,
    canMap,
    canRef,
    dataCallbacks,
    realtime
  ];

  const Session = DefineMap.extend('Session', {
    email: 'string',
    password: 'string',
    data: {
      type: User.Ref.type
    },
    token: 'string',
    type: 'string'
  });

  Session.List = DefineList.extend({
    '*': Session
  });

  connect(behaviors, {
    url: {
      createData: data => feathers.authenticate(data),
      destroyData: () => feathers.logout()
    },
    idProp: '_id',
    Map: Session,
    List: Session.List,
    name: 'session'
  });

  QUnit.test('catch promise on no auth', function(assert){
    var done = assert.async();

    // Clear the token.
    feathers.logout().then(() => {
      Account.findAll({})
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        assert.ok(err, 'Got an error from findAll');
        assert.ok((err.toString().indexOf('NotAuthenticated') >= 0 || err.toString().indexOf('TypeError: Reflect.construct is not a function') >= 0), 'got a not-authenticated error');
        done();
      });
    });

  });

  QUnit.test('authenticate without data returns error', function(assert){
    var done = assert.async();

    // Clear the token.
    feathers.logout();

    var session = new Session({});
    session.save()
    .then(function(res){
      console.log('res', res);
    })
    .catch(function(err){
      assert.equal(err.name === 'NotAuthenticated' || err.name === 'TypeError', true, `got back error message: ${err.name}`);
      done();
    });
  });

  QUnit.test('authenticate type=local', function(assert){
    var done = assert.async();

    // Create a user.
    var user = new User({
      email: 'marshall@bitovi.com',
      password: 'L1nds3y-Stirling-R0cks!'
    });
    user.save().then(createdUser => {
      assert.ok(createdUser instanceof User, 'created a new user');

      // Attempt to login with the user.
      var session = new Session({
        type: 'local',
        email: user.email,
        password: user.password
      });
      session.save()
      // Handle login success.
      .then(newSession => {
        assert.ok(newSession, 'successfully logged in');
        assert.ok(newSession instanceof Session, 'got back a session instance');
        assert.ok(newSession.token, 'got back a token');
        assert.ok(newSession.data.value instanceof User, 'got back a user instance through the ref');

        // Create an account for the logged in user.
        var account = new Account({
          name: 'Checking'
        });
        account.save()
        .then(newAccount => {
          assert.ok(newAccount, 'created an account');
          assert.equal(newAccount.userId, session.data._id, 'the server assigned the userId correctly');
          done();
        })
        .catch(err => {
          console.error(err);
          assert.notOk(err, `shouldn't have had a problem creating an account`);
          done();
        });
      })
      // Leave this here for easier tracking if it breaks.
      .catch(function(err){
        assert.notOk(err.name, `this error shouldn't happen: ${err.name}`);
        done();
      });
    })
    // Leave this here for easier tracking if it breaks.
    .catch(function(err){
      assert.notOk(err.name, `this error shouldn't happen: ${err.name}`);
      done();
    });
  });

  QUnit.test('authenticate type=token', function(assert){
    var done = assert.async();

    // Create a user.
    var user = new User({
      email: 'marshall@bitovi.com',
      password: 'L1nds3y-Stirling-R0cks!'
    });
    user.save().then(createdUser => {
      assert.ok(createdUser instanceof User, 'created a new user');

      // Attempt to login with the user.
      var session = new Session({
        type: 'local',
        email: user.email,
        password: user.password
      });
      session.save()
      // Handle login success.
      .then(newSession => {
        assert.ok(newSession, 'successfully logged in');
        assert.ok(newSession instanceof Session, 'got back a session instance');
        assert.ok(newSession.token, 'got back a token');
        assert.ok(newSession.data.value instanceof User, 'got back a user instance through the ref');

        var token = newSession.token;

        feathers.logout();

        var anotherSession = new Session({ token });
        anotherSession.save().then(newlyCreatedSession => {
          assert.ok(newlyCreatedSession, 'successfully logged in');
          assert.ok(newlyCreatedSession instanceof Session, 'got back a session instance');
          assert.ok(newlyCreatedSession.token, 'got back a token');
          assert.ok(newlyCreatedSession.data.value instanceof User, 'got back a user instance through the ref');

          // Create an account for the logged in user.
          var account = new Account({
            name: 'Checking'
          });
          account.save()
          .then(newAccount => {
            assert.ok(newAccount, 'created an account');
            assert.equal(newAccount.userId, session.data._id, 'the server assigned the userId correctly');
            done();
          })
          .catch(err => {
            console.error(err);
            assert.notOk(err, `shouldn't have had a problem creating an account`);
            done();
          });
        });
      })
      // Leave this here for easier tracking if it breaks.
      .catch(function(err){
        assert.notOk(err.name, `this error shouldn't happen: ${err.name}`);
        done();
      });
    });
  });
});



QUnit.module('Socket.io Auth Integration', {
  beforeEach(){
    localStorage.clear();
  }
}, function(){

  var feathers = new Feathers({
    url: 'http://localhost:3333',
    idProp: '_id',
    socketOptions:{
      transports: ['websocket']
    },
    jquery: $
  });
  var Message = DefineMap.extend('Message', {
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

  var User = DefineMap.extend({
    _id: '*',
    email: 'string'
  });

  User.List = DefineList.extend({
    '*': User
  });

  var userConnection = superMap({
    url: feathers.socketio('users'), // Connect the instance to your model.
    idProp: '_id',
    Map: User,
    List: User.List,
    name: 'user'
  });

  // Connect to realtime events.
  feathers.io.on('users created', user => userConnection.createInstance(user));
  feathers.io.on('users updated', user => userConnection.updateInstance(user));
  feathers.io.on('users patched', user => userConnection.updateInstance(user));
  feathers.io.on('users removed', user => userConnection.destroyInstance(user));

  var Account = DefineMap.extend('Account', {
    _id: '*',
    name: 'string',
    userId: '*'
  });

  Account.List = DefineList.extend({
    '*': Account
  });

  var accountConnection = superMap({
    url: feathers.socketio('accounts'), // Connect the instance to your model.
    idProp: '_id',
    Map: Account,
    List: Account.List,
    name: 'account'
  });

  // Connect to realtime events.
  feathers.io.on('accounts created', account => accountConnection.createInstance(account));
  feathers.io.on('accounts updated', account => accountConnection.updateInstance(account));
  feathers.io.on('accounts patched', account => accountConnection.updateInstance(account));
  feathers.io.on('accounts removed', account => accountConnection.destroyInstance(account));

  var behaviors = [
    dataUrl,
    dataParse,
    construct,
    constructStore,
    constructOnce,
    canMap,
    canRef,
    dataCallbacks,
    realtime
  ];

  const Session = DefineMap.extend('Session', {
    email: 'string',
    password: 'string',
    data: {
      type: User.Ref.type
    },
    token: 'string',
    type: 'string'
  });

  Session.List = DefineList.extend({
    '*': Session
  });

  connect(behaviors, {
    url: {
      createData: data => feathers.authenticate(data),
      destroyData: () => feathers.logout()
    },
    idProp: '_id',
    Map: Session,
    List: Session.List,
    name: 'session'
  });

  QUnit.test('catch promise on no auth', function(assert){
    var done = assert.async();

    // Clear the token.
    feathers.logout().then(() => {
      Account.findAll({})
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        assert.ok(err, 'Got an error from findAll');
        assert.equal(err.className, 'not-authenticated', 'got a not-authenticated error');
        done();
      });
    });

  });

  QUnit.test('authenticate without data returns error', function(assert){
    var done = assert.async();

    // Clear the token.
    feathers.logout();

    var session = new Session({});
    session.save()
    .then(function(res){
      console.log('res', res);
    })
    .catch(function(err){
      assert.equal(err.name, 'NotAuthenticated', `got back error message: ${err.name}`);
      done();
    });
  });

  QUnit.test('authenticate type=local', function(assert){
    var done = assert.async();

    // Create a user.
    var user = new User({
      email: 'marshall@bitovi.com',
      password: 'L1nds3y-Stirling-R0cks!'
    });
    user.save().then(createdUser => {
      assert.ok(createdUser instanceof User, 'created a new user');

      // Attempt to login with the user.
      var session = new Session({
        type: 'local',
        email: user.email,
        password: user.password
      });
      session.save()
      // Handle login success.
      .then(newSession => {
        assert.ok(newSession, 'successfully logged in');
        assert.ok(newSession instanceof Session, 'got back a session instance');
        assert.ok(newSession.token, 'got back a token');
        assert.ok(newSession.data.value instanceof User, 'got back a user instance through the ref');

        // Create an account for the logged in user.
        var account = new Account({
          name: 'Checking'
        });
        account.save()
        .then(newAccount => {
          assert.ok(newAccount, 'created an account');
          assert.equal(newAccount.userId, session.data._id, 'the server assigned the userId correctly');
          done();
        })
        .catch(err => {
          console.error(err);
          assert.notOk(err, `shouldn't have had a problem creating an account`);
          done();
        });
      })
      // Leave this here for easier tracking if it breaks.
      .catch(function(err){
        assert.notOk(err.name, `this error shouldn't happen: ${err.name}`);
        done();
      });
    });
  });

  QUnit.test('authenticate type=token', function(assert){
    var done = assert.async();

    // Create a user.
    var user = new User({
      email: 'marshall@bitovi.com',
      password: 'L1nds3y-Stirling-R0cks!'
    });
    user.save().then(createdUser => {
      assert.ok(createdUser instanceof User, 'created a new user');

      // Attempt to login with the user.
      var session = new Session({
        type: 'local',
        email: user.email,
        password: user.password
      });
      session.save()
      // Handle login success.
      .then(newSession => {
        assert.ok(newSession, 'successfully logged in');
        assert.ok(newSession instanceof Session, 'got back a session instance');
        assert.ok(newSession.token, 'got back a token');
        assert.ok(newSession.data.value instanceof User, 'got back a user instance through the ref');

        var token = newSession.token;

        feathers.logout();

        var anotherSession = new Session({ token });
        anotherSession.save().then(newlyCreatedSession => {
          assert.ok(newlyCreatedSession, 'successfully logged in');
          assert.ok(newlyCreatedSession instanceof Session, 'got back a session instance');
          assert.ok(newlyCreatedSession.token, 'got back a token');
          assert.ok(newlyCreatedSession.data.value instanceof User, 'got back a user instance through the ref');

          // Create an account for the logged in user.
          var account = new Account({
            name: 'Checking'
          });
          account.save()
          .then(newAccount => {
            assert.ok(newAccount, 'created an account');
            assert.equal(newAccount.userId, session.data._id, 'the server assigned the userId correctly');
            done();
          })
          .catch(err => {
            console.error(err);
            assert.notOk(err, `shouldn't have had a problem creating an account`);
            done();
          });
        });
      })
      // Leave this here for easier tracking if it breaks.
      .catch(function(err){
        assert.notOk(err.name, `this error shouldn't happen: ${err.name}`);
        done();
      });
    });
  });
});
