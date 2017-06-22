/* jshint esversion: 6 */
'use strict';

var testSauceLabs = require('test-saucelabs');

// https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities
var platforms = [{
	browserName: 'firefox',
	platform: 'Windows 10',
	version: '49.0'
}, {
	browserName: 'googlechrome',
	platform: 'Windows 10',
	version: '57.0'
}, {
	browserName: 'safari',
	platform: 'OS X 10.11',
	version: '10.0'
}, {
	browserName: 'internet explorer',
	platform: 'Windows 10',
	version: '11.0'
}, {
	browserName: 'internet explorer',
	platform: 'Windows 8',
	version: '10.0'
}, {
	browserName: 'internet explorer',
	platform: 'Windows 7',
	version: '9'
}, {
	browserName: 'Safari',
	'appium-version': '1.6.3',
	platformName: 'iOS',
	platformVersion: '10.0',
	deviceName: 'iPhone 7 Simulator'
}, {
	browserName: 'MicrosoftEdge',
	platform: 'Windows 10'
}];

var url = 'http://localhost:3000/test/test.html?hidepassed';

testSauceLabs({
	urls: [{ name: "can-connect-feathers", url : url }],
	platforms: platforms
});
