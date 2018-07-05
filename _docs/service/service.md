@module {connect.Behavior} can-connect-feathers/service/service
@parent can-connect-feathers.behaviors
@group can-connect-feathers/service/service.options options
@group can-connect-feathers/service/service.data-methods data methods

@signature `feathersService(baseConnect)`

Connects the [can-connect/DataInterface] methods to the Feathers [Service Interface](https://docs.feathersjs.com/services/readme.html#service-methods) methods.

```js
connect( [
	feathersService,
	realtime
], {
	feathersService: feathersClient.service( "/api/todos" )
} );
```

For can-connect's real-time functionality to work with this behavior, the [can-connect/real-time/real-time real-time behavior] must also be included as shown in the examples.

@body

The `feathers-service` behavior maps can-connect's [can-connect/DataInterface] methods to FeathersJS's [Service Interface](https://docs.feathersjs.com/services/readme.html#service-methods) methods.

```
| DataInterface method | Feathers method | HTTP method | Example Path |
|----------------------|-----------------|-------------|--------------|
| .getListData()       | .find()         | GET         | /todos       |
| .getData()           | .get()          | GET         | /todos/{id}  |
| .createData()        | .create()       | POST        | /todos       |
| .updateData()        | .update()       | PUT         | /todos/{id}  |
| not yet implemented  | .patch()        | PATCH       | /todos/{id}  |
| .destroyData()       | .remove()       | DELETE      | /todos/{id}  |
```

## Use

Setting up the Feathers Client is a prerequisite for using this behavior.  See the [can-connect-feathers] page for an example of a basic Feathers Client configuration.  With the Feathers client setup, it can be used with the `feathers-service` behavior as demonstrated in the example, below.  Also note that the [can-connect/real-time/real-time real-time] behavior is included to receive real-time push events from the server.

```js
// models/todo.js
import connect from "can-connect";

import DefineMap from "can-define/map/";
import DefineList from "can-define/list/list";
import set from "can-set-legacy";

// Bring in the feathers service behavior
import feathersServiceBehavior from "can-connect-feathers/service";

import dataParse from "can-connect/data/parse/";
import constructor from "can-connect/constructor/";
import constructorStore from "can-connect/constructor/store/";
import constructorCallbacksOnce from "can-connect/constructor/callbacks-once/";
import canMap from "can-connect/can/map/";
import canRef from "can-connect/can/ref/";
import dataCallbacks from "can-connect/data/callbacks/";
import realtime from "can-connect/real-time/";

// Bring in the feathersClient instance.
import feathersClient from "./feathers";

// Use feathersClient.service(url) to create a service
const todoService = feathersClient.service( "/api/todos" );

const Todo = DefineMap.extend( "Todo", {
	_id: "string",
	description: "string",
	complete: "boolean"
} );

Todo.algebra = new set.Algebra(
	set.comparators.id( "_id" )
);

Todo.List = DefineList.extend( { "*": Todo } );

Todo.connection = connect( [

	// Include the feathers service behavior in the behaviors list.
	feathersServiceBehavior,
	dataParse,
	constructor,
	constructorStore,
	constructorCallbacksOnce,
	canMap,
	canRef,

	// Include both the dataCallbacks and realtime behaviors.
	dataCallbacks,
	realtime
], {
	idProp: "_id",
	Map: Todo,
	List: Todo.List,

	// Pass the service as the `feathersService` property.
	feathersService: todoService,
	name: "todos",
	algebra: Todo.algebra
} );

export default Todo;
```

In the above example, both `Todo` and `Todo.connection` will have methods for handling data, as described in the [can-connect basic use] section.
