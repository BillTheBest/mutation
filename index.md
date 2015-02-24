<div class="project-header">
<div class="project-name">Mutation</div>
<div class="intro">
Allows for declarative mutation of JavaScript objects. Is extremely useful for mutating things like default values and configuration objects.
Works by recursing over a target object and applying any mutation directives it finds in the source object.
</div></div>

## Source ##

Read the annotated source <a href="mutation.js.html" target="_blank">here</a>

<div class="clear"></div>
<div class="spacer"></div>

## API ##

Here's a list of the available advice API methods:

| Type      |  Behavior  |
| ------------ | ------------------------------------------------------------------------------------------- |
| extendWith    | Mutates a target object using a source object. Keys with no mutation operators are simply replaced. |
| deepExtendWith       |  Mutates a target object using a source object. Keys with no mutation operators are recursively mutated. |
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

<div class="left">
	The simplest possible example might be a delete operation on a target object.
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

Let's take an example of where this might be useful. Suppose we have some instance where we are defining some default configuration.
However, we would like the user to be able to change the behaviour of the instance be passing in some options. Mutation allows us
to setup a format for such configuration without explicitly needing to define such override behaviour.

Check out the example for this <a href="examples/example1.md.html">here</a>