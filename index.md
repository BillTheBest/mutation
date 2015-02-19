<div class="project-header">
<div class="project-name">Mutation</div>
<div class="intro">
<i>Plugin for <a href="https://lodash.com/" target="_blank">lodash</a> .</i>
Mutation provides a declarative api for mutating values.
</div></div>

## Source ##

Read the annotated source <a href="mutation.js.html" target="_blank">here</a>

<div class="clear"></div>
<div class="spacer"></div>

## API ##

Here's a list of the available advice API methods that are added onto lodash

| Type      |  Behavior  |
| ------------ | ------------------------------------------------------------------------------------------- |
| extendWith    | Adds on the supplied method to be called before the original method(s) run |
| deepExtendWith       |  Adds on the supplied method to be called after the original method(s) have run |
| mutateWith   | Mutates a source object given a target object and some mutation settings |

The following is a list of all the valid mutation operators:

| Operator      |  Behavior  |
| ------------ | ------------------------------------------------------------------------------------------- |
| extend    | Extends an object given another one |
| deepExtend       |  Extends an object given another to an infinite depth |
| delete   | Deletes the given value |
| push   | Pushes into an array |
| insertAt   | Inserts into an array at the given index |
| callWith   | Calls a function with the given source value |
| extendFunction   | Calls the source function after the target function and returns the return value of the target extended with the return value of the source function |
| deepExtendFunction   | Same as extendFunction except deep extends the return value |

## Usage ##

There are a number of useful declaretive mutations provided by the Mutation library.

<div class="left">
	Delete a value
</div>

```javascript
var foo = {
	a: 1,
	b: 2
};
var bar = {
	'delete.b': true
}
Mutation.extendWith(foo, bar);
// console.log(foo.b) is undefined
```
<div class="left">
	Extend or replace a value
</div>
```javascript
var foo = {
	a: {
		one: 1,
		two: 2
	},
	b: {
		three: 3,
		four: 4
	}
};
var bar = {
	'extend.a': {
		three: 3
	},
	'replace.b': {
		six: 6
	}
};
Mutation.extendWith(a, b);
// console.log(foo.a.three) is 3
// console.log(foo.b.six) is 6
// console.log(foo.b.three) is undefined
```