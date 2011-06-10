var fs = require("fs"),
    sys = require("sys"),
    path = require("path");

/**
This is the **module** description for the `YUIDoc` module.

    var options = {
        paths: [ './lib' ],
        outdir: './out'
    };

    var Y = require('yuidoc');
    var json = (new Y.YUIDoc(options)).run();

* @main yuidoc
*/


YUI.add('yuidoc', function(Y) {


    /**
     * The default list of configuration options
     * @property OPTIONS
     * @type Object
     * @final
     * @for YUIDoc
     */

    var OPTIONS = {
        writeJSON: true,
        outdir: path.join(process.cwd(),  'out'),
        extension: '.js',
        exclude: '.DS_Store,.svn,CVS,.git,build_rollup_tmp,build_tmp',
        norecurse: false,
        version: '0.1.0',
        paths: [],
        themedir: path.join(__dirname,  'themes', 'default')
    };

    /**
     * YUIDoc main class

    var options = {
        paths: [ './lib' ],
        outdir: './out'
    };

    var Y = require('yuidoc');
    var json = (new Y.YUIDoc(options)).run();
     
     * @class YUIDoc
     * @module yuidoc
     * @constructor
     * @param config The config object
     */
    Y.YUIDoc = function(config) {
        /**
         * Holds the number of files that we are processing.
         * @property filecount
         * @type Boolean
         * @private
         */
        this.filecount = 0;
        /**
         * Holder for the list of files we are processing.
         * @property filemap
         * @type Object
         * @private
         */
        this.filemap = {};
        /**
         * Holder for the list of directories we are processing.
         * @property dirmap
         * @type Object
         * @private
         */
        this.dirmap = {};

        /**
         * Internal holder for configuration options.
         * @property options
         * @type Object
         * @private
         */
        this.options = Y.merge(OPTIONS, config);

    };

    Y.YUIDoc.prototype = {
        /**
         * Does post process on self.options.
         * @method _processConfig
         * @private
         */
        _processConfig: function() {
            this.options.extensions = Y.Array.hash(this.options.extension.split(','));
            this.options.excludes = Y.Array.hash(this.options.exclude.split(','));
        },
        /**
         * Walks the paths and parses the directory contents
         * @method walk
         * @private
         */
        walk: function() {
            Y.each(this.options.paths, function(dir) {
                this.parsedir(dir);
            }, this);
        },
        /**
         * Walks the passed directory and grabs all the files recursively.
         * @method parsedir
         * @param {String} dir The directory to parse the contents of.
         * @private
         */
        parsedir: function(dir) {
            if (!Y.Files.isDirectory(dir)) {
                throw('Can not find directory: ' + dir);
            }
            var allfiles = fs.readdirSync(dir), stats,
                files = [], fullpath, self = this;

            Y.each(allfiles, function(filename) {
                if (!(filename in self.options.excludes)) {
                    fullpath = path.join(dir, filename);

                    stats = fs.statSync(fullpath);

                    if (stats.isDirectory() && !self.options.norecurse) {
                        self.parsedir(fullpath);
                    } else {
                        files.push(filename);
                    }
                }
            });

            this.parsefiles(dir, files);
        },
        /**
         * Gathers all the file data and populates the filemap and dirmap hashes.
         * @method parsefiles
         * @param {String} dir The directory to start from.
         * @param {Array} files List of files to parse.
         * @private
         */
        parsefiles: function(dir, files) {
            var self = this;

            Y.each(files, function(filename) {
                var ext = path.extname(filename), text, fullpath;

                if (ext) {
                    if (ext in self.options.extensions) {
                        fullpath = path.join(dir, filename);

                        if (path.existsSync(fullpath)) {
                            self.filecount++;
                            text = fs.readFileSync(fullpath, "utf8");

                            self.filemap[fullpath] = text;
                            self.dirmap[fullpath] = dir;
                        } else {
                            Y.log('File skipped: ' + fullpath, 'warn', 'yuidoc');
                        }
                    }
                }
            });
        },
        /**
         * Writes the parser JSON data to disk.
         * @method writeJSON
         * @param {Object} parser The DocParser instance to use
         * @private
         * @return {Object} The JSON data returned from the DocParser
         */
        writeJSON: function(parser) {
            var self = this;
            if (self.options.writeJSON) {
                // Y.log(Y.JSON.stringify(parser.data, null, 4));
                var file = path.join(self.options.outdir, 'data.json'), out;
                if (!path.existsSync(self.options.outdir)) {
                    Y.log('Making out dir: ' + self.options.outdir, 'warn', 'yuidoc');
                    fs.mkdirSync(self.options.outdir, 0777);
                } else {
                    Y.log('Using output directory: ' + self.options.outdir, 'info', 'yuidoc');
                }
                if (self.options.project) {
                    parser.data.project = self.options.project;
                }
                out = fs.createWriteStream(file, {
                        flags: "w", encoding: "utf8", mode: 0644
                });
                out.write(Y.JSON.stringify(parser.data, null, 4));
                out.end();
            }

            return parser.data;
        },
        /**
         * Process the config, walk the file tree and write out the JSON data.
         * @method run
         * @return {Object} The JSON data returned from the DocParser
         */
        run: function() {
            /**
             * Timestamp holder so we know when YUIDoc started the parse process.
             * @property starttime
             * @type Timestamp
             */
            Y.log('YUIDoc Starting from: ' + this.options.paths.join(','), 'info', 'yuidoc');
            this.starttime = new Date().getTime();

            var self = this;

            this._processConfig();
            this.walk();

            var json = this.writeJSON(new Y.DocParser({
                filemap: self.filemap,
                dirmap: self.dirmap
            }).parse());

            /**
             * Timestamp holder so we know when YUIDoc has finished the parse process.
             * @property endtime
             * @type Timestamp
             */
            this.endtime = new Date().getTime();

            Y.log('Parsed ' + this.filecount + ' files in ' + ((this.endtime - this.starttime) / 1000) + ' seconds', 'info', 'yuidoc');

            return json;
        }
    };

});
