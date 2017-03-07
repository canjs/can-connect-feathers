var stealTools = require('steal-tools');

stealTools.build({
	config: __dirname + '/package.json!npm',
	main: 'can-connect-feathers/test/test'
}, {
	minify: false
});
