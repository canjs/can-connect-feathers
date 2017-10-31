/*can-connect-feathers@3.7.0#can-connect-feathers*/
define([
    'require',
    'exports',
    'module',
    './service/service',
    './session/session'
], function (require, exports, module) {
    module.exports = {
        service: require('./service/service'),
        session: require('./session/session')
    };
});