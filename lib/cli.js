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
    options = {};

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
            options.version = args.shift();
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
        case "-o":
        case "--outdir":
            options.outdir = args.shift();
            break;
        case "-t":
        case "--themedir":
			options.themedir = args.shift();
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
    project = Y.getProjectData();
    if (!project) {
        project = {};
    }
}

if (project.options && Object.keys(project.options).length) {
    options = Y.merge(project.options, options);
    delete project.options;
    options.project = project;
}

if (!options.outdir) {
    options.outdir = './out';
}

options.paths = Y.validatePaths(options.paths, options.ignorePaths);

var json = (new Y.YUIDoc(options)).run();
if (json.project) {
    options = Y.merge(options, json.project);
}
if (options.title && !options.name) {
    options.name = options.title;
}
var builder = new Y.DocBuilder(options, json);
builder.compile(function() {
    var endtime = (new Date).getTime();
    Y.log('Completed in ' + ((endtime - starttime) / 1000) + ' seconds' , 'info', 'yuidoc');
});
