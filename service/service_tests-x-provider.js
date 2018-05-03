var QUnit = require('steal-qunit');
var DefineMap = require('can-define/map/');
var DefineList = require('can-define/list/');
// Behaviors
var serviceBehavior = require('./service');
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
var auth = require('feathers-authentication-client');
var set = require('can-set-legacy');

module.exports = function runProviderTests (options) {

	var Message;

	QUnit.module("can-connect-feathers/service - "+options.moduleName, {
		beforeEach: function () {
			window.localStorage.clear();
			options.fixtures();

			var behaviors = [
				serviceBehavior,
				dataParse,
				canMap,
				canRef,
				realtime,
				construct,
				constructStore,
				constructOnce,
				dataCallbacks
			];

			var app = feathers()
				.configure(options.provider)
				.configure(hooks())
				.configure(auth());

			Message = DefineMap.extend('Message', {
				_id: '*',
				text: 'string'
			});

			Message.List = DefineList.extend({
				'*': Message
			});

			Message.connection = connect(behaviors, {
				feathersService: app.service('messages'),
				idProp: '_id',
				Map: Message,
				List: Message.List,
				name: 'message',
				queryLogic: new set.Algebra(set.props.id('_id'))
			});

		}
	});








	QUnit.test('findAll', function (assert) {
		var done = assert.async();

		var randomNumber = Math.random();
		var messageText = "Welcome to can-connect-feathers! "+randomNumber;

		var message = new Message({
			text: messageText
		});
		message.save().then(function () {
			// Make sure the message was deleted.
			Message.findAll({text: messageText}).then(function (messages) {
				assert.ok(messages, 'Got a response from findAll');
				assert.equal(messages.length, 1, 'Query params were properly passed.');
				assert.equal(messages[0].text, messageText, 'Got back the correct message.');
				assert.equal(messages instanceof Message.List, true, 'got a Message.List back');
				done();
			});
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
			Message.get(id).then(function (findResponse) {
				assert.deepEqual(msg, findResponse, 'got same instance in find');
				done();
			});
		});
	});

	QUnit.test('findOne with params', function (assert) {
		var done = assert.async();

		var message = new Message({
			text: 'Hi there!'
		});
		message.save().then(function (msg) {
			var id = msg._id;
			Message.findOne({_id: id}).then(function (findResponse) {
				assert.deepEqual(msg, findResponse, 'got same instance in find passing params');
				done();
			});
		});
	});

	QUnit.test('findOne with many params', function (assert) {
		assert.expect(3);
		Message.connection.feathersService.get = function (id, params) {
			assert.equal(id, 123);
			assert.ok( !params.query.hasOwnProperty('_id') );
			assert.equal(params.query.foo, 'bar');
			return Promise.resolve({});
		};
		Message.findOne({ _id: 123, foo: 'bar' });
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

};
