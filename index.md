<div class="project-header">
<div class="project-name">Mutation</div>
<div class="intro">
<i>Plugin for <a href="https://lodash.com/" target="_blank">lodash</a> .</i>
Mutation provides a declarative api for mutating values.
</div></div>

## Source ##

Read the annotated source <a href="doc/mutation.js.html" target="_blank">here</a>

<div class="clear"></div>
<div class="spacer"></div>

## API ##

Here's a list of the available advice API methods that are added onto lodash

| Type      |  Behavior  |
| ------------ | ------------------------------------------------------------------------------------------- |
| extendWith    | Adds on the supplied method to be called before the original method(s) run |
| deepExtendWith       |  Adds on the supplied method to be called after the original method(s) have run |
| clobber   |  Overwrites the original properties of an object |
| around    |  Adds on the supplied method instead of the super method, but passes a reference to the original method as the first argument followed by the arguments the method was called with |
| addToObj | Extends the keys of an object with the keys of the provided object |
| setDefaults | Adds properties (methods, objects, etc) to the constructor if they don't already exist |
| mixin | Pass an array of mixins that should be mixed in to the target object |


## Usage ##
<div class="left">
There are a number of ways of adding advice to an object. But first, one must add the advice API to a given object class.
</div>

```javascript
Advice.addAdvice(recipientOfAdvice);
```


## Examples ##
<a href="doc/examples/example1.md.html" target="_blank">Simple Example With an 'After'</a>
<a href="doc/examples/example2.md.html" target="_blank">Example with a Backbone application</a>
