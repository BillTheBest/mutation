// ==========================================
// Copyright 2014 Dataminr
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ==========================================

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['underscore','mutation-js'], function(_, Mutation) {
            root._ = factory(root, _, Mutation);
            return root._;
        });
    } else if (typeof exports !== 'undefined') {
        var _ = require('underscore');
        var Mutation = require('mutation-js');
        module.exports = factory(root, _, Mutation);
    } else {
        root._ = factory(root, root._, root.Mutation);
    }
}(this, function(root, _, Mutation) {
    _.mixin({
        transformValue: Mutation.transformValue,
        transformValueFromSourceKey: Mutation.transformValueFromSourceKey,
        mutateKey: Mutation.mutateKey,
        getExtendMutateSettings: Mutation.getExtendMutateSettings,
        getDeepExtendMutateSettings: Mutation.getDeepExtendMutateSettings,
        getDefaultMutationOperators: Mutation.getDefaultMutationOperators,
        getRecurseMutateSettings: Mutation.getRecurseMutateSettings,
        extendWith: Mutation.extendWith,
        deepExtendWith: Mutation.deepExtendWith,
        mutateWith: Mutation.mutateWith,
        deepExtendBase: Mutation.deepExtendBase,
        extendBase: Mutation.extendBase
    });
    return _;
}));
