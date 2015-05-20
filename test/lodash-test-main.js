/**
 * Copy of setup code from Karma website to make work with requirejs.
 * This file is included both by karma test runner as well as our
 * index.html file that runs tests in the browser itself.
 *
 * We therefore perform different actions depending on which environment
 * we're running in.
 *
 */

// Define an array of "deps" for requirejs to have in karma environment only
var deps = ["lodash.mutation"];
// Define a regex to match which of our files to load as deps in karma
// This is a match done against all the files karma has loaded into the
// base directory
var TEST_REGEXP = /test-core\.js$/;
var pathToModule = function(path) {
    return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};
//If this is karma define test files as deps to run when require has loaded
if(window.__karma__) {
    Object.keys(window.__karma__.files).forEach(function(file) {
        if (TEST_REGEXP.test(file)) {
            // Normalize paths to RequireJS module names.
            deps.push(pathToModule(file));
        }
    });
}

// Requirejs callback once all deps have loaded
function startTests() {
    // Start tests if karma
    if(window.__karma__) {
        window.__karma__.start();
        // Start tests if browser by requiring and
        // setting up mocha and then requiring the tests
        // and calling run
    } else {
        var allTestFiles = [
            'test/test-core'
        ];
        require(['mocha'], function(mocha) {
            mocha.setup('bdd');
            require(allTestFiles, function() {
                mocha.run();
            })
        });
    }
}

require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: window.__karma__ ? '/base' : '../',
    paths: {
        //---------- LIB ----------//
        chai: 'bower_components/chai/chai',
        mocha: 'bower_components/mocha/mocha',
        sinonChai: 'bower_components/sinon-chai/lib/sinon-chai',
        sinon: 'bower_components/sinonjs/sinon',
        "lodash": 'bower_components/lodash/dist/lodash',
        "underscore": 'bower_components/lodash/dist/lodash',
        "mutation-js": '.',
        "test-core": "test/test-core",
        "lodash.mutation": "lodash.mutation"
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        "test-core": {
            deps: ["mutation-js/mutation"]
        },
        mocha: {
            exports: "mocha",
            init: function () {
                console.log('setting up mocha');
                this.mocha.setup('bdd');
                return this.mocha;
            }
        }
    },
    // dynamically load all test files in karma environment
    deps: deps,

    // callback once all deps have loaded
    callback: startTests,

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    waitSeconds: 60
});