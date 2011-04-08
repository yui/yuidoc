#!/usr/bin/env node

/**
* Parses the arguments, creates the options and passes them to Y.YUIDoc.
* @class cli
* @module yuidoc
*/

var Y = require('yuidocjs'),
    fs = require('fs'),
    path = require('path');

var args = Y.Array(process.argv, 2),
    options = {
        outdir: 'out'
    };

while (args.length > 0) {
    var v = args.shift();
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
            if (!options.paths) {
                options.paths = [];
            }
            options.paths.push(v);
    }
}

var starttime = (new Date).getTime();

var project = {};
if (options.configfile) {
    project = Y.Files.getJSON(options.configfile);
} else {
    var f = path.join(process.cwd(), 'yuidoc.json');
    project = Y.Files.getJSON(f);
}

if (project.options && Object.keys(project.options).length) {
    options = Y.merge(project.options, options);
    delete project.options;
    options.project = project;
}

//TODO now, process the JSON and add templating..
var json = (new Y.YUIDoc(options)).run();

var builder = new Y.Builder(options, json);
builder.compile(function() {
    var endtime = (new Date).getTime();
    Y.log('Completed in ' + ((endtime - starttime) / 1000) + ' seconds' , 'info', 'yuidoc');
});
