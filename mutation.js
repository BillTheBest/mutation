/**
 * @version 0.1
 *
 * @fileOverview Provides a declarative API for mutating values.
 *
 * Copyright 2015 Dataminr
 * Licensed under The MIT License
 * http://opensource.org/licenses/MIT

 *
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['lodash'], function(_) {
            root.Mutation = factory(root, _);
            return root.Mutation;
        });
    } else if (typeof exports !== 'undefined') {
        var _ = require('lodash');
        module.exports = factory(root, _);
    } else {
        root.Mutation = factory(root, root._);
    }
}(this, function(root, _) {

    var slice = Array.prototype.slice;

    // Helper function to evaluate an input as function
    // or a value
    var funcOrVal = function(input, context) {
        var args = slice.call(arguments, 2);
        return (typeof input == "function") ? input.apply(context, args) : input;
    };

    // Valid operators
    var validMutationOperators = {
        deepExtend: 'deepExtend.',
        delete: 'delete.',
        extend: 'extend.',
        replace: 'replace.',
        callWith: 'callWith.',
        recurse: 'recurse.',
        extendFunction: 'extendFunc.',
        deepExtendFunction: 'deepExtendFunc.',
        push: 'push.',
        insertAt: /insertAt(.*)\./i
    };
    // Get clean version of key without operator
    var getCleanMutationKey = function(key) {
        if(key == null) return;
        var newKey = key.slice();
        var ops = _.values(validMutationOperators)
            .sort(function(a,b) { return a < b  });
        _.each(ops, function(op) {
            if(newKey.indexOf(op) != -1 || op instanceof RegExp) {
                newKey = newKey.replace(op, '');
            }
        }, this);
        return newKey;
    };
    // Get a valid mutation operator given a key
    var getMutationOperator = function(key) {
        if(key == null) return;
        return _.find(_.values(validMutationOperators), function(op) {
            if(key.indexOf(op) != -1) return true;
            if(op instanceof RegExp) return op.test(key);
        });
    };
    // Get the arguments to the mutation function given a regex operator
    var getMutationArgs = function(key, op) {
        if(!(op instanceof RegExp)) return [];
        return key.match(op).slice(1);
    };
    // Get all the keys from an object with a mutation operator on them
    var getMutationKeys = function(obj, cleanKey) {
        if(!obj) return [];
        return _.filter(_.keys(obj), function(key) {
            return ( (key.length > cleanKey.length) && getCleanMutationKey(key) == cleanKey);
        });
    };

    var Mutation = {
        /**
         * #### extendWith
         * Is basically _.extend on steroids. Looks at the source object keys for operator
         * prefixes like 'extend.myVariable' or 'deepExtend.myVariable' or 'callWith.myFunc'
         * and mutates the values on the target object with the specified operation
         * If no operator is provided it defaults to setting the source object value
         * on the target object.
         * @param target {object} Object to be mutated
         * @param source {object} Source object for mutation
         * @param settings {object} (Optional) Settings for mutation
         * @returns {*}
         */
        extendWith: function(target, source, settings) {
            target = funcOrVal(target, this, target, source);
            source = funcOrVal(source, this, target, source);
            return Mutation.mutateWith(target, source, Mutation.getExtendMutateSettings(settings));
        },
        /**
         * #### deepExtendWith
         * Same as extendWith. Deep extends a target object given a source object. Supports
         * all the same operators on keys. Defaults to deepExtend.
         * @param target {object} Object to be mutated
         * @param source {object} Source object for mutation
         * @param settings {object} (Optional) Settings for mutation
         * @returns {*}
         */
        deepExtendWith: function(target, source, settings) {
            return Mutation.mutateWith(target, source, Mutation.getDeepExtendMutateSettings(settings));
        },
        /**
         * #### mutateWith
         * Largely internal function that accepts a target and source object
         * for mutation as well as settings for mutation
         * @param target {object} Object to be mutated
         * @param source {object} Source object for mutation
         * @param settings (Optional) {object} Settings for mutation
         * @returns {*}
         */
        mutateWith: function(target, source, settings) {
            if(typeof source == "undefined") return target;
            if(!_.isPlainObject(target) || !_.isPlainObject(source)) {
                return console.error('Invalid format for mutate');
            }
            settings = settings || {};
            var getCleanKey = settings.getCleanKey || getCleanMutationKey;
            _.each(_.uniq(_.map(_.keys(source), function(key){ return getCleanKey(key); })), function(key) {
                Mutation.mutateKey(target, source, key, settings);
            }, this);
            return target;
        },
        /**
         * #### transformValue
         * Transforms a value with another value given an operator
         * Operators are listed at the top of this file under validMutationOperators
         * Returns undefined in case the operator was 'delete.'
         * @param oldVal {*} value to transform
         * @param newVal {*} value to transform with
         * @param operator {string|regexp} mutation operator
         * @param settings (Optional) {object} settings for mutation
         * @returns {*}
         */
        transformValue: function(oldVal, newVal, operator, settings, args) {
            settings = settings || {
            };
            var operators = settings.operators || validMutationOperators;
            var context = settings.context;
            //If delete return undefined to signal deletion
            if(operator == operators["delete"])  {
                return undefined;
            }
            //If no operator dont do any transformation and just return old value
            if(!operator) return oldVal;
            if(operator == operators["replace"]){
                return (typeof newVal !== "undefined") ? newVal : oldVal;
            }
            if(_.isFunction(oldVal)) {
                // Function  -- Create new function that deep extends result of original
                if(operator == operators["deepExtendFunction"]) {
                    return function() {
                        var context = context || this;
                        var oldResult = oldVal.apply(context, _.toArray(arguments));
                        var newResult = (_.isFunction(newVal)) ? newVal.apply(context, _.toArray(arguments)) : newVal;
                        return Mutation.deepExtendWith(oldResult, newResult);
                    };
                    // Function  -- Create new function that extends result of original
                } else if(operator == operators["extendFunction"]) {
                    return function() {
                        var context = context || this;
                        var oldResult = oldVal.apply(context, _.toArray(arguments));
                        var newResult = (_.isFunction(newVal)) ? newVal.apply(context, _.toArray(arguments)) : newVal;
                        return Mutation.extendWith(oldResult, newResult);
                    };
                    // Call original function with the new value
                } else if(operator == operators["callWith"]) {
                    return oldVal.call(context, newVal);
                }
            } else if(_.isPlainObject(oldVal)) {
                if(operator == operators["recurse"]) return Mutation.mutateWith(oldVal, newVal, Mutation.getRecurseMutateSettings());
                if(_.isPlainObject(newVal) || _.isFunction(newVal)) {
                    // Deep Extend original object with new Object or run new Function and deep extend with the result
                    if(operator == operators["deepExtend"]) {
                        return Mutation.deepExtendWith(oldVal, funcOrVal(newVal, context));
                        // Extend original object with new Object or run new Function and extend with the result
                    } else if(operator == operators["extend"]) {
                        return Mutation.extendWith(oldVal, funcOrVal(newVal, context));
                    }
                }
            } else if(_.isArray(oldVal)) {
                if(operator == operators["push"]) {
                    oldVal.push(newVal);
                    return oldVal;
                }
                if(operator == operators["insertAt"]) {
                    oldVal.splice(args[0], 0, newVal);
                    return oldVal;
                }
            }
            // By Default Extend / Deep Extend and Recurse replace
            if(operator == operators["extend"] || operator == operators["deepExtend"] || operator == operators["deepExtendFunction"] || operator == operators["extendFunction"]) {
                return newVal || oldVal
            }
            return oldVal;
        },
        /**
         * #### transformValueFromSourceKey
         * Transforms a value by parsing all valid operators associated with a given key on
         * a source Object.  Example the value could be an { foo: "bar" } and the source object
         * could contain a key thats called 'extend.foo' with a value. The value would be returned
         * as an extended version of the original with the value on the source object.
         * @param val
         * @param source
         * @param key
         * @param settings
         * @returns {*}
         */
        transformValueFromSourceKey: function(val, source, key, settings) {
            settings = settings || {};
            var getMKeysForKey = settings.getMutationKeysForKey || getMutationKeys;
            var getMOperator = settings.getMutationOperator || getMutationOperator;
            var sortMKeys = settings.mutationOrder || function(a,b) { return a > b; };
            var mutationKeys = getMKeysForKey(source, key).sort(sortMKeys);
            var result = val;
            if(mutationKeys.length) {
                _.each(mutationKeys, function(mKey) {
                    var oldVal = result;
                    var operator = getMOperator(mKey);
                    var newVal = source[mKey];
                    var args = getMutationArgs(mKey, operator);
                    result = Mutation.transformValue(oldVal, newVal, operator, settings, args);
                });
            }
            return result;
        },
        /**
         * #### mutateKey
         * Mutate the value on a target object from all the valid keys on the
         * source object.
         * @param target {object} target object to mutate
         * @param source {object} source object to mutate from
         * @param key {string} key to use for mutation
         * @param settings {object} (Optional) mutation settings
         * @returns {*}
         */
        mutateKey: function(target, source, key, settings) {
            settings = settings || {};
            var result = Mutation.transformValueFromSourceKey(target[key], source, key, settings);
            if(result === undefined) {
                delete target[key];
            } else {
                target[key] = result;
            }
            return target;
        },
        getExtendMutateSettings: function(settings) {
            settings = settings || {};
            settings = _.clone(settings);
            var getMKey = settings.getMutationKeysForKey || getMutationKeys;
            var getMOperator = settings.getMutationOperator || getMutationOperator;
            return _.extend(settings, {
                getMutationKeysForKey: function(obj, cleanKey) {
                    return _.uniq(getMKey(obj, cleanKey).concat([cleanKey]));
                },
                getMutationOperator: function(key) {
                    var op = getMOperator(key);
                    return (op || validMutationOperators["replace"]);
                }
            });
        },
        getDeepExtendMutateSettings: function(settings) {
            settings = settings || {};
            settings = _.clone(settings);
            var getMKey = settings.getMutationKeysForKey || getMutationKeys;
            var getMOperator = settings.getMutationOperator || getMutationOperator;
            return _.extend(settings, {
                getMutationKeysForKey: function(obj, cleanKey) {
                    return _.uniq(getMKey(obj, cleanKey).concat([cleanKey]));
                },
                getMutationOperator: function(key) {
                    return (getMOperator(key) || validMutationOperators["deepExtend"]);
                }
            });
        },
        getDefaultMutationOperators: function() {
            return validMutationOperators;
        },
        getRecurseMutateSettings: function(settings) {
            settings = settings || {};
            settings = _.clone(settings);
            var getMKey = settings.getMutationKeysForKey || getMutationKeys;
            var getMOperator = settings.getMutationOperator || getMutationOperator;
            return _.extend(settings, {
                getMutationKeysForKey: function(obj, cleanKey) {
                    return _.uniq(getMKey(obj, cleanKey).concat([cleanKey]));
                },
                getMutationOperator: function(key) {
                    return (getMOperator(key) || validMutationOperators["recurse"]);
                }
            });
        },
        deepExtendBase: function(base, protoProps, staticProps) {
            var parent = base;
            var child;

            // The constructor function for the new subclass is either defined by you
            // (the "constructor" property in your `extend` definition), or defaulted
            // by us to simply call the parent's constructor.
            if (protoProps && _.has(protoProps, 'constructor')) {
                child = protoProps.constructor;
            } else {
                child = function(){ return parent.apply(this, arguments); };
            }

            // Add static properties to the constructor function, if supplied.
            _.merge(child, parent, staticProps);

            // Set the prototype chain to inherit from `parent`, without calling
            // `parent`'s constructor function.
            var Surrogate = function(){ this.constructor = child; };
            Surrogate.prototype = parent.prototype;
            child.prototype = new Surrogate;

            // Add prototype properties (instance properties) to the subclass,
            // if supplied.
            if (protoProps) _.merge(child.prototype, protoProps);

            // Set a convenience property in case the parent's prototype is needed
            // later.
            child.__super__ = parent.prototype;

            return child;
        },
        extendBase: function(base, protoProps, staticProps) {
            var parent = base;
            var child;

            // The constructor function for the new subclass is either defined by you
            // (the "constructor" property in your `extend` definition), or defaulted
            // by us to simply call the parent's constructor.
            if (protoProps && _.has(protoProps, 'constructor')) {
                child = protoProps.constructor;
            } else {
                child = function(){ return parent.apply(this, arguments); };
            }

            // Add static properties to the constructor function, if supplied.
            _.extend(child, parent, staticProps);

            // Set the prototype chain to inherit from `parent`, without calling
            // `parent`'s constructor function.
            var Surrogate = function(){ this.constructor = child; };
            Surrogate.prototype = parent.prototype;
            child.prototype = new Surrogate;

            // Add prototype properties (instance properties) to the subclass,
            // if supplied.
            if (protoProps) _.extend(child.prototype, protoProps);

            // Set a convenience property in case the parent's prototype is needed
            // later.
            child.__super__ = parent.prototype;

            return child;
        }
    };

    return Mutation;
}));