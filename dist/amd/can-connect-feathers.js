/*can-connect-feathers@4.1.0#can-connect-feathers*/
define([
    'require',
    'exports',
    'module',
    './service/service',
    './session/session'
], function (require, exports, module) {
    'use strict';
    module.exports = {
        service: require('./service/service'),
        session: require('./session/session')
    };
});