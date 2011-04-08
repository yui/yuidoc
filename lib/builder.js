var markdown = require("node-markdown").Markdown,
    fs = require('fs'),
    handlebars = require('./handlebars').Handlebars,
    noop = function() {},
    path = require('path'),
    TEMPLATE;

/**
* Takes the `JSON` data from the `DocParser` class, creates and parses markdown and handlebars
based templates to generate static HTML content
* @class Builder
* @module yuidoc
*/

YUI.add('builder', function(Y) {

    var themeDir = path.join(__dirname, '../', 'themes', 'default');

    Y.Builder = function(options, data) {
        this.options = options;
        this.data = data;
        Y.log('Building..', 'info', 'builder');
        this.files = 0;
    };

    Y.Builder.prototype = {
        /**
        * The default tags to use in params descriptions (for Markdown).
        * @property defaultTags
        * @type String
        */
        defaultTags: 'code|em|strong|span|a',
        /**
        * File counter
        * @property files
        * @type Number
        */
        files: null,
        /**
        * Prep the meta data to be fed to Selleck
        * @method getProjectMeta
        * @return {Object} The project metadata
        */
        getProjectMeta: function() {
            var obj = {
                meta: {
                    yuiSeedUrl: 'http://yui.yahooapis.com/3.3.0/build/yui/yui-min.js',
                    yuiGridsUrl: 'http://yui.yahooapis.com/3.3.0/build/cssgrids/grids-min.css'
                }
            };
            Y.each(this.data.project, function(v, k) {
                var key = k.substring(0, 1).toUpperCase() + k.substring(1, k.length);
                obj.meta['project' + key] = v;
            });
            return obj
        },
        /**
        * Populate the meta data for classes
        * @method populateClasses
        * @param {Object} opts The original options
        * @return {Object} The modified options
        */
        populateClasses: function(opts) {
            opts.meta.classes = [];
            Y.each(this.data.classes, function(v) {
                opts.meta.classes.push({ displayName: v.name, name: v.name});
            });
            return opts;
        },
        /**
        * Populate the meta data for modules
        * @method populateModules
        * @param {Object} opts The original options
        * @return {Object} The modified options
        */
        populateModules: function(opts) {
            var self = this;
            opts.meta.modules = [];
            Y.each(this.data.modules, function(v) {
                if (!v.is_submodule) {
                    var o = { displayName: v.name, name: v.name };
                    if (v.submodules) {
                        o.submodules = [];
                        Y.each(v.submodules, function(i, k) {
                            o.submodules.push({ displayName: k, description: self.data.modules[k].description });
                        });
                    }
                    opts.meta.modules.push(o);
                }
            });
            return opts;
        },
        /**
        * Populate the meta data for files
        * @method populateFiles
        * @param {Object} opts The original options
        * @return {Object} The modified options
        */
        populateFiles: function(opts) {
            opts.meta.files = [];
            Y.each(this.data.files, function(v) {
                opts.meta.files.push({ displayName: v.name, name: path.basename(v.name), path: v.name });
            });
            return opts;
        },
        /**
        * Augments the **DocParser** meta data to provide default values for certain keys as well as parses all descriptions
        * with the `Markdown Parser`
        * @method augmentData
        * @param {Object} o The object to recurse and augment
        * @return {Object} The augmented object
        */
        augmentData: function(o) {
            var self = this;
            Y.each(o, function(i, k1) {
                if (i.forEach) {
                    Y.each(i, function(a, k) {
                        if (!(a instanceof Object)) {
                            return;
                        }
                        if (!a.type) {
                            a.type = 'UNKOWN';
                        }
                        if (!a.description) {
                            a.description = ' ';
                        } else {
                            a.description = markdown(a.description, true, self.defaultTags);
                        }

                        Y.each(a, function(c, d) {
                            if (c.forEach || (c instanceof Object)) {
                                c = self.augmentData(c);
                                a[d] = c;
                            }
                        });

                        o[k1][k] = a;
                    });
                } else if (i instanceof Object) {
                    Y.each(i, function(v, k) {
                        if (k === 'description') {
                            o[k1][k] = markdown(v, true, self.defaultTags);
                        }
                    });
                } else if (k1 === 'description') {
                    o[k1] = markdown(i, true, self.defaultTags);
                }
            });
            return o;
        },
        /**
        * Makes the default directories needed 
        * @method makeDirs
        * @param {Callback} cb The callback to execute after it's completed
        */
        makeDirs: function(cb) {
            var self = this;
            var dirs = ['classes', 'modules', 'files'];
            var stack = new Y.Parallel();
            Y.log('Making default directories: ' + dirs.join(','), 'info', 'builder');
            dirs.forEach(function(d) {
                var dir = path.join(self.options.outdir, d);
                path.exists(dir, stack.add(function(x) {
                    if (!x) {
                        fs.mkdir(dir, 0777, stack.add(noop));
                    }
                }));
            });
            stack.done(function() {
                if (cb) {
                    cb();
                }
            });
        },
        /**
        * Parses `<pre><code>` tags and adds the __prettyprint__ `className` to them
        * @method _parseCode
        * @private
        * @param {HTML} html The HTML to parse
        * @return {HTML} The parsed HTML
        */
        _parseCode: function (html) {
            html = html.replace(/<pre><code>/g, '<pre class="code"><code class="prettyprint">');
            return html;
        },
        /**
        * Ported from [Selleck](https://github.com/rgrove/selleck), this handles ```'s in fields
        that are not parsed by the **Markdown** parser.
        * @method _inlineCode
        * @private
        * @param {HTML} html The HTML to parse
        * @return {HTML} The parsed HTML
        */
        _inlineCode: function(html) {
            html = html.replace(/\\`/g, '__{{SELLECK_BACKTICK}}__');
            
            html = html.replace(/`(.+?)`/g, function (match, code) {
                return '<code>' + Y.escapeHTML(code) + '</code>';
            });

            html = html.replace(/__\{\{SELLECK_BACKTICK\}\}__/g, '`');

            return html;
        },
        /**
        * Ported from [Selleck](https://github.com/rgrove/selleck)  
        Renders the handlebars templates with the default View class.
        * @method render
        * @param {HTML} source The default template to parse
        * @param {Class} view The default view handler
        * @param {HTML} [layout=null] The HTML from the layout to use.
        * @param {Object} [partials=object] List of partials to include in this template
        * @param {Callback} callback
        * @param {Error} callback.err
        * @param {HTML} callback.html The assembled template markup
        */
        render: function(source, view, layout, partials, callback) {
            var html = [];

            function buffer(line) {
                html.push(line);
            }

            // Allow callback as third or fourth param.
            if (typeof partials === 'function') {
                callback = partials;
                partials = {};
            } else if (typeof layout === 'function') {
                callback = layout;
                layout = null;
            }
            var parts = Y.merge(partials || {}, { layout_content: source });
            Y.each(parts, function(source, name) {
                handlebars.registerPartial(name, source);
            });

            if (!TEMPLATE) {
                TEMPLATE = handlebars.compile(layout);
            }
            
            
            var _v = {};
            for (var k in view) {
                if (Y.Lang.isFunction(view[k])) {
                    _v[k] = view[k]();
                } else {
                    _v[k] = view[k];
                }
            };
            html = TEMPLATE(_v);
            
            html = this._inlineCode(html);
            callback(null, html);
        },
        /**
        * Generates the index.html file
        * @method writeIndex
        * @param {Callback} cb The callback to execute after it's completed
        */
        writeIndex: function(cb) {
            var self = this;
            Y.prepare(themeDir, self.getProjectMeta(), function(err, opts) {
                Y.log('Preparing index.html', 'info', 'builder');

                //opts.meta.htmlTitle = self.data.project.name;
                opts.meta.title = self.data.project.name;
                opts.meta.projectRoot = './';
                opts.meta.projectAssets = './assets';

                opts = self.populateClasses(opts);
                opts = self.populateModules(opts);

                var view   = new Y.View(opts.meta);
                self.render('{{>index}}', view, opts.layouts.main, opts.partials, function(err, html) {
                    Y.log('Writing index.html', 'info', 'builder');
                    self.files++;
                    Y.Files.writeFile(path.join(self.options.outdir, 'index.html'), html, cb);
                });
            });
        },
        /**
        * Generates the module files under "out"/modules/
        * @method writeModules
        * @param {Callback} cb The callback to execute after it's completed
        */
        writeModules: function(cb) {
            var self = this;
            var stack = new Y.Parallel();
            Y.log('Writing (' + Object.keys(self.data.modules).length + ') module pages', 'info', 'builder');
            Y.each(this.data.modules, function(v) {
                Y.prepare(themeDir, self.getProjectMeta(), function(err, opts) {
                    //opts.meta.htmlTitle = v.name + ': ' + self.data.project.name;
                    opts.meta.title = self.data.project.name;

                    opts.meta.moduleName = v.name;
                    opts.meta.moduleDescription = self._parseCode(markdown(v.description || ' '));
                    opts.meta.file = v.file;
                    opts.meta.line = v.line;
                    opts.meta.projectRoot = '../';
                    opts.meta.projectAssets = '../assets';

                    opts = self.populateClasses(opts);
                    opts = self.populateModules(opts);
                    opts = self.populateFiles(opts);

                    opts.meta.moduleClasses = [];
                    if (v.classes) {
                        Y.each(Object.keys(v.classes), function(name) {
                            var i = self.data.classes[name];
                            opts.meta.moduleClasses.push({ name: i.name, displayName: i.name });
                        });
                    }
                    opts.meta.subModules = [];
                    if (v.submodules) {
                        Y.each(Object.keys(v.submodules), function(name) {
                            var i = self.data.modules[name];
                            opts.meta.subModules.push({ displayName: i.name, description: i.description });
                        });
                    }

                    var view   = new Y.View(opts.meta);
                    self.render('{{>module}}', view, opts.layouts.main, opts.partials, stack.add(function(err, html) {
                        self.files++;
                        Y.Files.writeFile(path.join(self.options.outdir, 'modules', v.name + '.html'), html, stack.add(noop));
                    }));
                });
            });

            stack.done(function() {
                Y.log('Finished writing module files', 'info', 'builder');
                cb();
            });
        },
        /**
        * Generates the class files under "out"/classes/
        * @method writeClasses
        * @param {Callback} cb The callback to execute after it's completed
        */
        writeClasses: function(cb) {
            var self = this;
            var stack = new Y.Parallel();
            
            Y.log('Writing (' + Object.keys(self.data.classes).length + ') class pages', 'info', 'builder');
            Y.each(self.data.classes, function(v) {
                Y.prepare(themeDir, self.getProjectMeta(), function(err, opts) {
                    //console.log(opts);
                    if (err) {
                        console.log(err);
                    }
                    opts.meta.title = self.data.project.name;
                    opts.meta.moduleName = v.name;
                    opts.meta.projectRoot = '../';
                    opts.meta.projectAssets = '../assets';

                    opts = self.populateClasses(opts);
                    opts = self.populateModules(opts);
                    opts = self.populateFiles(opts);

                    opts.meta.classDescription = self._parseCode(markdown(v.description || ' '));

                    opts.meta.methods = [];
                    opts.meta.properties = [];
                    opts.meta.attrs = [];
                    self.data.classitems.forEach(function(i) {
                        if (i.class === v.name) {
                            switch (i.itemtype) {
                                case 'method':
                                    i = self.augmentData(i);
                                    i.paramsList = [];
                                    if (i.params) {
                                        i.params.forEach(function(p, v) {
                                            var name = p.name;
                                            if (p.optional) {
                                                name = '[' + name + ((p.optdefault) ? '=' + p.optdefault : '') + ']'
                                            }
                                            i.paramsList.push(name);
                                        });
                                    }

                                    i.methodDescription = self._parseCode(markdown(i.description));
                                    i.hasAccessType = i.access;
                                    i.hasParams = i.paramsList.length;
                                    if (i.paramsList.length) {
                                        i.paramsList = i.paramsList.join(', ');
                                    } else {
                                        i.paramsList = ' ';
                                    }
                                    i.returnType = 'void';
                                    i.returnType = ' ';
                                    if (i.return) {
                                        i.hasReturn = true;
                                        i.returnType = i.return.type;
                                    }
                                    opts.meta.methods.push(i);
                                    break;
                                case 'property':
                                    if (!i.type) {
                                        i.type = 'unknown';
                                    }
                                    opts.meta.properties.push(i);
                                    break;
                                case 'attribute':
                                    opts.meta.attrs.push(i);
                                    break;
                            }
                        }
                    });


                    if (!opts.meta.methods.length) {
                        delete opts.meta.methods;
                    }
                    if (!opts.meta.properties.length) {
                        delete opts.meta.properties;
                    }

                    var view   = new Y.View(opts.meta);
                    self.render('{{>classes}}', view, opts.layouts.main, opts.partials, stack.add(function(err, html) {
                        self.files++;
                        Y.Files.writeFile(path.join(self.options.outdir, 'classes', v.name + '.html'), html, stack.add(noop));
                    }));
                });
            });

            stack.done(function() {
                Y.log('Finished writing class files', 'info', 'builder');
                cb();
            });
        },
        /**
        * Generates the syntax files under "out"/files/
        * @method writeFiles
        * @param {Callback} cb The callback to execute after it's completed
        */
        writeFiles: function(cb) {
            var self = this;
            var stack = new Y.Parallel();
            
            Y.log('Writing (' + Object.keys(self.data.files).length + ') source files', 'info', 'builder');
            Y.each(self.data.files, function(v) {
                Y.prepare(themeDir, self.getProjectMeta(), function(err, opts) {
                    if (err) {
                        console.log(err);
                    }
                    if (!v.name) {
                        return;
                    }
                    opts.meta.title = self.data.project.name;

                    opts.meta.moduleName = v.name;
                    opts.meta.projectRoot = '../';
                    opts.meta.projectAssets = '../assets';

                    opts = self.populateClasses(opts);
                    opts = self.populateModules(opts);
                    opts = self.populateFiles(opts);
                    
                    opts.meta.fileName = v.name;
                    Y.Files.readFile(v.name, encoding='utf8', stack.add(Y.rbind(function(err, data, opts, v) {
                        opts.meta.fileData = data;
                        var view   = new Y.View(opts.meta, 'index');
                        self.render('{{>files}}', view, opts.layouts.main, opts.partials, function(err, html) {
                            self.files++;
                            Y.Files.writeFile(path.join(self.options.outdir, 'files', path.basename(v.name) + '.html'), html, stack.add(noop));
                        });

                    }, this, opts, v)));
                });
            });

            stack.done(function() {
                Y.log('Finished writing source files', 'info', 'builder');
                cb();
            });
        },
        /**
        * Compiles the templates from the meta-data provided by DocParser
        * @method compile
        * @param {Callback} cb The callback to execute after it's completed
        */
        compile: function(cb) {
            var self = this;
            var starttime = (new Date()).getTime();
            Y.log('Compiling Templates', 'info', 'builder');

            this.makeDirs(function() {
                Y.log('Copying Assets', 'info', 'builder');
                Y.Files.copyAssets(path.join(themeDir, 'assets'), path.join(self.options.outdir, 'assets'), true, function() {
                    var cstack = new Y.Parallel();
                    self.writeModules(cstack.add(function() {
                        self.writeClasses(cstack.add(noop));
                    }));
                    self.writeFiles(cstack.add(noop));
                    self.writeIndex(cstack.add(noop));
                    cstack.done(function() {
                        var endtime = (new Date()).getTime();
                        var timer = ((endtime - starttime) / 1000) + ' seconds';
                        Y.log('Finished writing ' + self.files + ' files in ' + timer, 'info', 'builder');
                        if (cb) { cb(); }
                    });
                });
            });
        }
    }
});
