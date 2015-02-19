// ==========================================
// Copyright 2014 Dataminr
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ==========================================

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['lodash','mutation'], function(_, Mutation) {
            root._ = factory(root, _, Mutation);
            return root._;
        });
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