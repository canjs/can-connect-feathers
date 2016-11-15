var QUnit = require('steal-qunit');
var DefineMap = require('can-define/map/');
var DefineList = require('can-define/list/');
// Behaviors
var feathersBehavior = require('../feathers/');
var feathersSession = require('./session');
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
var auth = require('feathers-authentication/client');

module.exports = function runSessionTests (options) {
  QUnit.module(`Authentication: ${options.moduleName}`, {
    beforeEach () {
      window.localStorage.clear();
    }
  }, function () {
    var app = feathers()
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

    var messageService = app.service('messages');

    connect(behaviors, {
      feathersService: messageService,
      idProp: '_id',
      Map: Message,
      List: Message.List,
      name: 'message'
    });

    var User = DefineMap.extend({
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

    var accountService = app.service('accounts');

    connect(behaviors, {
      feathersService: accountService,
      idProp: '_id',
      Map: Account,
      List: Account.List,
      name: 'account'
    });

    var sessionBehaviors = [
      dataParse,
      construct,
      constructStore,
      constructOnce,
      canMap,
      canRef,
      dataCallbacks,
      realtime,
      feathersSession
    ];

    var Session = DefineMap.extend('Session', {
      seal: false
    }, {
      _id: '*',
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

    connect(sessionBehaviors, {
      feathersApp: app,
      idProp: '_id',
      Map: Session,
      List: Session.List,
      name: 'session'
    });

    QUnit.test('catch promise on no auth', function (assert) {
      var done = assert.async();

      // Clear the token.
      app.logout().then(() => {
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

    QUnit.test('authenticate without data returns error', function (assert) {
      var done = assert.async();

      // Clear the token.
      app.logout();

      var session = new Session({});
      session.save()
      .then(function (res) {
        console.log('res', res);
      })
      .catch(function (err) {
        assert.equal(err.name, 'NotAuthenticated', `got back error message: ${err.name}`);
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
        assert.equal(err.name, 'NotAuthenticated', `got back error message: ${err.name}`);
        done();
      });
    });

    QUnit.test('Session.get() returns a token payload after logged in', function (assert) {
      var done = assert.async();

      // Clear the token.
      app.logout();

      var user = new User({
        email: 'marshall@bitovi.com',
        password: 'L1nds3y-Stirling-R0cks!'
      });
      user.save().then(createdUser => {
        var newLoginUser = new User({
          email: 'marshall@bitovi.com',
          password: 'L1nds3y-Stirling-R0cks!'
        });
        var session = new Session({
          type: 'local',
          user: newLoginUser
        });
        session.save()
        .then(function (res) {
          console.log('res', res);
        })
        .catch(function (err) {
          assert.equal(err.name, 'NotAuthenticated', `got back error message: ${err.name}`);
          done();
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

          // Create an account for the logged in user.
          var account = new Account({
            name: 'Checking'
          });
          account.save()
          .then(newAccount => {
            assert.ok(newAccount, 'created an account');
            done();
          })
          .catch(err => {
            console.error(err);
            assert.notOk(err, `shouldn't have had a problem creating an account`);
            done();
          });
        })
        // Leave this here for easier tracking if it breaks.
        .catch(function (err) {
          assert.notOk(err.name, `this error shouldn't happen: ${err.name}`);
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

          app.authentication.getJWT().then(token => {
            app.logout();

            var anotherSession = new Session({ type: 'token', token });
            anotherSession.save().then(newlyCreatedSession => {
              assert.ok(newlyCreatedSession, 'successfully logged in');
              assert.ok(newlyCreatedSession instanceof Session, 'got back a session instance');

              // Create an account for the logged in user.
              var account = new Account({
                name: 'Checking'
              });
              account.save()
              .then(newAccount => {
                assert.ok(newAccount, 'created an account');
                assert.equal(newAccount.userId, session._id, 'the server assigned the userId correctly');
                done();
              })
              .catch(err => {
                console.error(err);
                assert.notOk(err, `shouldn't have had a problem creating an account`);
                done();
              });
            }).catch(e => {
              console.log(e);
            });
          });
        })
        // Leave this here for easier tracking if it breaks.
        .catch(function (err) {
          assert.notOk(err.name, `this error shouldn't happen: ${err.name}`);
          done();
        });
      });
    });
  });
};
