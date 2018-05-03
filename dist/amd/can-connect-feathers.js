/*can-connect-feathers@5.0.0-pre.0#can-connect-feathers*/
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