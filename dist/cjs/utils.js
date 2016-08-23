/*can-connect-feathers@0.6.5#utils*/
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.stripSlashes = stripSlashes;
function stripSlashes(location) {
    return location.replace(/^(\/*)|(\/*)$/g, '');
}