#!/usr/bin/env node

var YUI = require("yui3").YUI,
    fs = require("fs"),
    sys = require("sys"),
    path = require("path");

YUI({
    modules: {
        docparser: {
            fullpath: path.join(__dirname, 'docparser.js'),
            requires: ['base-base', 'json-stringify']
        },
        yuidoc: {
            fullpath: path.join(__dirname, 'yuidoc.js')
        }
    },
    logExclude: {
        yui: true,
        get: true,
        loader: true
    }
}).use('docparser', 'yuidoc', function(Y) {

    var args = Y.Array(process.argv, 2),
        options = {
            paths: []
        };

    while (args.length > 0) {
        var v = args.shift();
        switch (v) {
            case "-e":
            case "--extension":
                options.extension = args.shift();
                break;
            case "-x":
            case "--exclude":
                options.extension = args.shift();
                break;
            case "-v":
            case "--version":
                options.version = args.shift();
                break;
            case "-n":
            case "--norecurse":
                options.norecurse = true;
                break;
            case "-o":
            case "--outdir":
                options.outdir = args.shift();
                break;
            default:
                options.paths.push(v);
        }
    }

    
    (new Y.YUIDoc(options)).run();
});
