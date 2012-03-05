#!/usr/bin/env node
/*
Copyright (c) 2011, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/

/**
* Parses the arguments, creates the options and passes them to Y.YUIDoc.
* @class cli
* @module yuidoc
*/

var Y = require('./index'),
    path = require('path');

var args = Y.Array(process.argv, 2),
    options = {
        port: 3000,
        nocode: false
    };

while (args.length > 0) {
    var v = args.shift();
	// options.* defined in ./builder.js
    switch (v) {
        case "-c":
        case "--config":
        case "--configfile":
            options.configfile = args.shift();
            break;
        case "-e":
        case "--extension":
            options.extension = args.shift();
            break;
        case "-x":
        case "--exclude":
            options.exclude = args.shift();
            break;
        case "-v":
        case "--version":
            console.error(Y.packageInfo.version);
            process.exit(1);
            break;
        case "--project-version":
            options.version = args.shift();
            break;
        case "-N":
        case "--no-color":
            Y.config.useColor = false;
            options.nocolor = true;
            break;
        case "-C":
        case "--no-code":
            options.nocode = true;
            break;
        case "-n":
        case "--norecurse":
            options.norecurse = true;
            break;
        case "-S":
        case "--selleck":
            options.selleck = true;
            break;
        case "-V":
        case "--view":
            options.dumpview = true;
            break;
        case "-p":
        case "--parse-only":
            options.parseOnly = true;
            break;
        case "-o":
        case "--outdir":
            options.outdir = args.shift();
            break;
        case "-t":
        case "--themedir":
			options.themedir = args.shift();
            break;
        case "--server":
            options.server = true;
            var p = parseInt(args.shift(), 10);
            if (isNaN(p) || !p) {
                Y.log('Failed to extract port, setting to the default :3000', 'warn', 'yuidoc');
            } else {
                options.port = p;
            }
            break;
        case "-h":
        case "--help":
            Y.showHelp();
            break;
        case "-T":
        case "--theme":
            var theme = args.shift();
            options.themedir = path.join(__dirname, '../', 'themes', theme);
            break;
        default:
            if (!options.paths) {
                options.paths = [];
            }
            options.paths.push(v);
    }
}

Y.log('Starting YUIDoc@' + Y.packageInfo.version + ' using YUI@' + Y.version + ' with NodeJS@' + process.versions.node, 'info', 'yuidoc');

var starttime = (new Date).getTime();

options = Y.Project.init(options);

Y.log('Starting YUIDoc with the following options:', 'info', 'yuidoc');
var opts = Y.clone(options);
if (opts.paths && opts.paths.length && (opts.paths.length > 10)) {
    opts.paths = [].concat(opts.paths.slice(0, 5), ['<paths truncated>'], options.paths.slice(-5));
}
Y.log(opts, 'info', 'yuidoc');

if (options.server) {
    Y.Server.start(options);
} else {

    var json = (new Y.YUIDoc(options)).run();
    options = Y.Project.mix(json, options);

    if (!options.parseOnly) {
        var builder = new Y.DocBuilder(options, json);
        builder.compile(function() {
            var endtime = (new Date).getTime();
            Y.log('Completed in ' + ((endtime - starttime) / 1000) + ' seconds' , 'info', 'yuidoc');
        });
    }
}
