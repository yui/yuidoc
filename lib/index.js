/*
Copyright (c) 2011, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/
/**
* Module creates the YUI instance with the required modules, uses them and exports the **Y** to be used
* by the _CLI class_ or by extenders: `require('yuidocjs');`  
* You can use it like this:  

    var options = {
        paths: [ './lib' ],
        outdir: './out'
    };

    var Y = require('yuidoc');
    var json = (new Y.YUIDoc(options)).run();

* @class index
* @exports {YUI} Y A YUI instance
* @module yuidoc
*/

var YUI = require('yui3').YUI,
    path = require('path');

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
            fullpath: path.join(__dirname, 'builder.js')
        },
        utils: {
            fullpath: path.join(__dirname, 'utils.js')
        },
        docview: {
            fullpath: path.join(__dirname, 'docview.js')
        }
    },
    logExclude: {
        yui: true,
        get: true,
        loader: true,
        files: true
    }
}).useSync('docparser', 'yuidoc', 'utils', 'doc-builder', 'docview', 'files', 'help');

Y.packageInfo = Y.Files.getJSON(path.join(__dirname, '../', 'package.json'));

module.exports = Y;
