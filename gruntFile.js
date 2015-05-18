'use strict';

module.exports = function(grunt) {
    var port = '9000';
    var connect = require('./node_modules/grunt-contrib-connect/tasks/connect');
    // File paths for the docs pages. Generally should be kept like this
    var docFilePaths = ['index.md', 'examples'];


    /*** File paths for your source files **/
    var sourceFilePaths = ['mutation.js'];

    grunt.initConfig({

        karma: {
            test: {
                configFile: 'karma.conf.js'
            },
            "test-lodash": {
                configFile: 'lodash-test-conf.js'
            }
        },

        connect: {
            all: {
                options:{
                    port: 9000,
                    hostname: "0.0.0.0",
                    // Prevents Grunt to close just after the task (starting the server) completes
                    // This will be removed later as `watch` will take care of that
                    keepalive: true
                }
            }
        },

        // grunt-open will open your browser at the project's URL
        open: {
            all: {
                // Gets the port from the connect configuration
                path: 'http://localhost:<%= connect.all.options.port%>/bin/'
            }
        },
        shell: {
            "install-deps": {
                command: 'npm install && bower install'
            },
            "github-pages-delete": {
                command: 'hasPages=`git branch --list gh-pages`; if [ -n "$hasPages" ]; then git branch -D gh-pages; else echo boo; fi'
            },
            "github-pages-checkout": {
                command: 'git checkout -b gh-pages'
            },
            "github-pages-add": {
                command: 'git add -A'
            },
            "github-pages-commit": {
                command: 'git commit -m "Docs for github"'
            },
            "github-pages-push": {
                command: [
                    'git push github gh-pages'
                ]
            },
            "movedocs": {
                command: "mv doc/* ."
            },
            "renamemain": {
                command: "cp index.md.html index.html"
            }
        },
        clean: {
            rest: ["*",
                "!doc",
                "!node_modules",
                "!bower_components",
                "!resources"].concat(sourceFilePaths.map(function(val) {
                    return '!' + val;
                }))
        },
        docker: {
            options: {
                css: ['resources/docs-style.css']
                // These options are applied to all tasks
            },
            docs: {
                // Specify `src` and `dest` directly on the task object
                src: sourceFilePaths.concat(docFilePaths),
                dest: 'doc',
                options: {
                    sidebarState: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-shell-spawn');
    grunt.loadNpmTasks('grunt-docker');

    // Creates the `server` task
    grunt.registerTask('default',[
        // Open before connect because connect uses keepalive at the moment
        // so anything after connect wouldn't run
        'karma:test',
        'open',
        'connect'
    ]);

    // Creates the `server` task
    grunt.registerTask('lodash',[
        // Open before connect because connect uses keepalive at the moment
        // so anything after connect wouldn't run
        'karma:test-lodash',
        'open',
        'connect'
    ]);

    // Creates the `server` task
    grunt.registerTask('docs', [
        'shell:install-deps',
        'docker:docs'
    ]);

    grunt.registerTask('publishDocs', function() {
        grunt.task.run([
            'shell:github-pages-delete',
            'shell:github-pages-checkout',
            'clean:rest',
            'shell:movedocs',
            'shell:renamemain',
            'shell:github-pages-add',
            'shell:github-pages-commit'
        ]);
    });

};