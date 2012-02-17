/*
Copyright (c) 2011, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/
/**
Module creates the YUI instance with the required modules, uses them and exports the **Y** to be used
by the _CLI class_ or by extenders: `require('yuidocjs');`  
You can use it like this:  

    var options = {
        paths: [ './lib' ],
        outdir: './out'
    };

    var Y = require('yuidoc');
    var json = (new Y.YUIDoc(options)).run();

@class index
@exports {YUI} Y A YUI instance
@module yuidoc
*/

var YUI = require('yui').YUI,
    path = require('path'),
    fs = require('graceful-fs'),
    metaPath = path.join(__dirname, '../', 'package.json');


process.on('uncaughtException', function(msg) {
    var Y = YUI(),
        meta = JSON.parse(fs.readFileSync(metaPath));

    Y.log('--------------------------------------------------------------------------', 'error');
    Y.log('An uncaught YUIDoc error has occurred, stack trace given below', 'error');
    Y.log('--------------------------------------------------------------------------', 'error');
    Y.log(msg.stack, 'error');
    Y.log('--------------------------------------------------------------------------', 'error');
    Y.log('Node.js version: ' + process.version, 'error');
    Y.log('YUI version: ' + YUI.version, 'error');
    Y.log('YUIDoc version: ' + meta.version, 'error');
    Y.log('Please file all tickets here: ' + meta.bugs.url, 'error');
    Y.log('--------------------------------------------------------------------------', 'error');

    process.exit(1);
});

var Y = YUI({
    modules: {
        help: {
            fullpath: path.join(__dirname, 'help.js')
        },
        docparser: {
            fullpath: path.join(__dirname, 'docparser.js'),
            requires: ['base-base', 'json-stringify']
        },
        yuidoc: {
            fullpath: path.join(__dirname, 'yuidoc.js')
        },
        'doc-builder': {
            fullpath: path.join(__dirname, 'builder.js'),
            requires: ['parallel', 'handlebars']
        },
        utils: {
            fullpath: path.join(__dirname, 'utils.js')
        },
        files: {
            fullpath: path.join(__dirname, 'files.js')
        },
        docview: {
            fullpath: path.join(__dirname, 'docview.js')
        },
        server: {
            fullpath: path.join(__dirname, 'server.js')
        },
        project: {
            fullpath: path.join(__dirname, 'project.js')
        }
    },
    logExclude: {
        yui: true,
        get: true,
        files: true,
        loader: true
    },
    useSync: true
}).use('docparser', 'yuidoc', 'utils', 'doc-builder', 'docview', 'files', 'help', 'server', 'project');

Y.packageInfo = Y.Files.getJSON(metaPath);


module.exports = Y;
