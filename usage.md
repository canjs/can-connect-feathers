## Usage

### ES6 use

With StealJS, you can import this module directly in a template that is autorendered:

```js
import plugin from "can-connect-feathers";
```

### CommonJS use

Use `require` to load `can-connect-feathers` and everything else
needed to create a template that uses `can-connect-feathers`:

```js
import plugin from "can-connect-feathers";
```

## AMD use

Configure the `can` and `jquery` paths and the `can-connect-feathers` package:

```html
<script src="require.js"></script>
<script>
	require.config({
	    paths: {
	        "jquery": "node_modules/jquery/dist/jquery",
	        "can": "node_modules/canjs/dist/amd/can"
	    },
	    packages: [{
		    	name: 'can-connect-feathers',
		    	location: 'node_modules/can-connect-feathers/dist/amd',
		    	main: 'lib/can-connect-feathers'
	    }]
	});
	require(["main-amd"], function(){});
</script>
```

### Standalone use

Load the `global` version of the plugin:

```html
<script src='./node_modules/can-connect-feathers/dist/global/can-connect-feathers.js'></script>
```
