# Basic Example

## Demo

<div class="clear"></div>
<div class="left">
	In the example we see that we can easily override the properties of the instances by passing in an options object.
</div>
<iframe src="../resources/demos/demo1.html" class="demo-frame" style="height:300px"></iframe>

<div class="clear"></div>

## Code

Suppose we have some instance where we are defining some default configuration.
However, we would like the user to be able to change the behaviour of the instance be passing in some options. Mutation allows us
to setup a format for such configuration without explicitly needing to define such override behaviour.
<div class="spacer"></div>
<div class="left">
Define our class
</div>

```javascript
var Foo = function(options) {
	// Set the configuration of the class by
	// mutating some defaults with the options passed in
	this.configuration = Mutation.extendWith({
		hands: ['left', 'right'],
		evil: true,
		children: {
			'dave': {},
			'taylor': {}
		}
	}, options);
};
// Add a get method to retrieve a property
Foo.prototype.get = function(property) {
	return this.configuration[property];
};
```

<div class="clear"></div>
<div class="left">
Create our instances. One is instantiated with the default options,
whereas the other is instantiated with some overrides.
</div>

```javascript
var instance1 = new Foo();
var instance2 = new Foo({
	'delete.evil': true,
	'insertAt[0].hands': 'center',
	'extend.children': {
	 	'nate': {},
	 	'pate': {},
	 	'chris': {}
	 }
});
```