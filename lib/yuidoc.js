#! /usr/bin/env node
// -*- coding: utf-8 -*-
// vim: et sw=4 ts=4

var YUI = require("yui3").YUI,
    fs = require("fs"),
    sys = require("sys"),
    path = require("path");


YUI({
    modules: {
        docparser: {
            fullpath: path.join(__dirname, 'docparser.js'),
            requires: ['base-base', 'json-stringify']
        }
    },
    logExclude: {
        yui: true,
        get: true,
        loader: true
    }
}).use('docparser', function(Y) {

    var options = {
        outdir: path.join(process.cwd(),  'out'),
        extension: '.js',
        exclude: '.DS_Store,.svn,CVS,.git,build_rollup_tmp,build_tmp',
        norecurse: false,
        version: '0.1.0'
    },
    args = Y.Array(process.argv, 2),
    paths = [],
    config = function() {
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
                    paths.push(v);
            }
        }
        options.extensions = Y.Array.hash(options.extension.split(','));
        options.excludes = Y.Array.hash(options.exclude.split(','));
    },

    output = function(parser) {
        // Y.log(Y.JSON.stringify(parser.data, null, 4));
        var file = path.join(options.outdir, 'data.json'), out;
        if (!path.existsSync(options.outdir)) {
            Y.log('Making out dir: ' + options.outdir, 'warn', 'yuidoc');
            fs.mkdirSync(options.outdir, 0777);
        }
        out = fs.createWriteStream(file, {
                flags: "w", encoding: "utf8", mode: 0644
        });
        out.write(Y.JSON.stringify(parser.data, null, 4));
        out.end();
    },

    filemap = {},
    dirmap = {},

    run = function() {
        output(new Y.DocParser({
            filemap: filemap,
            dirmap: dirmap
        }).parse());
    },

    parsefiles = function(dir, files) {
        Y.each(files, function(filename) {
            var ext = path.extname(filename), text, fullpath;
            if (ext) {
                if (ext in options.extensions) {
                    fullpath = path.join(dir, filename);
                    if (path.existsSync(fullpath)) {
                        text = fs.readFileSync(fullpath, "utf8");
                        filemap[fullpath] = text;
                        dirmap[fullpath] = dir;
                    } else {
                        Y.log('File skipped: ' + fullpath, 'warn', 'yuidoc');
                    }
                }
            }
        });
    },

    parsedir = function(dir) {
        var allfiles = fs.readdirSync(dir), stats,
            files = [], fullpath;
        Y.each(allfiles, function(filename) {
            if (!(filename in options.excludes)) {
                fullpath = path.join(dir, filename);
                stats = fs.statSync(fullpath);
                if (stats.isDirectory() && !options.norecurse) {
                    parsedir(fullpath);
                } else {
                    files.push(filename);
                }
            }
        });

        parsefiles(dir, files);
    },

    load = function() {
        Y.each(paths, function(dir) {
            parsedir(dir);
        });
    };

    config();
    load();
    run();

});

