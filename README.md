# Mutation #

Allows for declarative mutation of JavaScript objects. Is extremely useful for mutating things like default values and configuration objects.
Works by recursing over a target object and applying any mutation directives it finds in the source object.

## Website ##

Visit the [website](http://dataminr.github.io/mutation) for usage, examples and annotated source code.

## Development ##

### Tests and Coverage ##

To generate a test and coverage report for mutation.js:

```javascript
grunt
```

To test lodash.mutation.js

```javascript
grunt lodash
```


### Documentation ###

To generate documentation from source code.

```javascript
grunt docs
```

To create a gh-pages branch from generated docs

```javascript
grunt publishDocs
```

## Contribution ##

This is very much a work in progress. There is a lot of scope for performance improvements and additional operators if need be.
Please feel free to contribute. Happy to see PRs!