const QUnit = require('steal-qunit');
const DefineMap = require('can-define/map/');
const DefineList = require('can-define/list/');
// Behaviors
const feathersBehavior = require('../feathers/');
const feathersSession = require('./session');
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

module.exports = function runSessionTests (options) {
  QUnit.module(`Authentication: ${options.moduleName}`, {
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

    var messageService = app.service('messages');

    var messageConnection = connect(behaviors, {
      service: messageService,
      idProp: '_id',
      Map: Message,
      List: Message.List,
      name: 'message'
    });

    // Connect to realtime events.
    messageService.on('created', message => messageConnection.createInstance(message));
    messageService.on('updated', message => messageConnection.updateInstance(message));
    messageService.on('patched', message => messageConnection.updateInstance(message));
    messageService.on('removed', message => messageConnection.destroyInstance(message));

    var User = DefineMap.extend({
      _id: '*',
      email: 'string'
    });

    User.List = DefineList.extend({
      '*': User
    });

    const userService = app.service('users');

    var userConnection = connect(behaviors, {
      service: userService,
      idProp: '_id',
      Map: User,
      List: User.List,
      name: 'user'
    });

    // Connect to realtime events.
    userService.on('created', user => userConnection.createInstance(user));
    userService.on('updated', user => userConnection.updateInstance(user));
    userService.on('patched', user => userConnection.updateInstance(user));
    userService.on('removed', user => userConnection.destroyInstance(user));

    var Account = DefineMap.extend('Account', {
      _id: '*',
      name: 'string',
      userId: '*'
    });

    Account.List = DefineList.extend({
      '*': Account
    });

    const accountService = app.service('accounts');

    var accountConnection = connect(behaviors, {
      service: accountService,
      idProp: '_id',
      Map: Account,
      List: Account.List,
      name: 'account'
    });

    // Connect to realtime events.
    accountService.on('created', account => accountConnection.createInstance(account));
    accountService.on('updated', account => accountConnection.updateInstance(account));
    accountService.on('patched', account => accountConnection.updateInstance(account));
    accountService.on('removed', account => accountConnection.destroyInstance(account));

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

    const Session = DefineMap.extend('Session', {
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
