/*can-connect-feathers@4.0.0#utils/utils*/
var decode = require('jwt-decode');
var assign = require('can-util/js/assign/assign');
function readCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}
function getStoredToken(storageLocation) {
    var token = readCookie(storageLocation);
    if (!token && (window && window.localStorage || window.sessionStorage)) {
        token = window.sessionStorage.getItem(storageLocation) || window.localStorage.getItem(storageLocation);
    }
    return token;
}
function payloadIsValid(payload) {
    return payload && payload.exp * 1000 > new Date().getTime();
}
function hasValidToken(storageLocation) {
    var token = getStoredToken(storageLocation);
    if (token) {
        try {
            var payload = decode(token);
            return payloadIsValid(payload);
        } catch (error) {
            return false;
        }
    }
    return false;
}
function convertLocalAuthData(originalData) {
    var data = assign({}, originalData);
    if (data && data.strategy === 'local' && data.user) {
        Object.keys(data.user).forEach(function (key) {
            data[key] = data.user[key];
        });
        delete data.user;
    }
    return data;
}
module.exports = {
    readCookie: readCookie,
    getStoredToken: getStoredToken,
    hasValidToken: hasValidToken,
    payloadIsValid: payloadIsValid,
    convertLocalAuthData: convertLocalAuthData
};