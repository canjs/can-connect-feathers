## Usage

### ES6 use

With StealJS, you can import this module directly in a template that is autorendered:

```js
import plugin from 'feathers-connect';
```

### CommonJS use

Use `require` to load `feathers-connect` and everything else
needed to create a template that uses `feathers-connect`:

```js
var plugin = require("feathers-connect");
```

## AMD use

Configure the `can` and `jquery` paths and the `feathers-connect` package:

```html
<script src="require.js"></script>
<script>
	require.config({
	    paths: {
	        "jquery": "node_modules/jquery/dist/jquery",
	        "can": "node_modules/canjs/dist/amd/can"
	    },
	    packages: [{
		    	name: 'feathers-connect',
		    	location: 'node_modules/feathers-connect/dist/amd',
		    	main: 'lib/feathers-connect'
	    }]
	});
	require(["main-amd"], function(){});
</script>
```

### Standalone use

Load the `global` version of the plugin:

```html
<script src='./node_modules/feathers-connect/dist/global/feathers-connect.js'></script>
```
