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

var YUI = require('yui3-base').YUI,
    path = require('path');

var Y = YUI({
    modules: {
        docparser: {
            fullpath: path.join(__dirname, 'docparser.js'),
            requires: ['base-base', 'json-stringify']
        },
        yuidoc: {
            fullpath: path.join(__dirname, 'yuidoc.js')
        },
        builder: {
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
        loader: true
    }
}).useSync('docparser', 'yuidoc', 'utils', 'builder', 'docview', 'files');

module.exports = Y;
