#! /usr/bin/env node
// -*- coding: utf-8 -*-
// vim: et sw=4 ts=4

var YUI = require("yui3").YUI;

YUI.add('docparser', function(Y) {

    var Lang = Y.Lang,
    trim = Lang.trim,
    stringify = Y.JSON.stringify,

    CURRENT_NAMESPACE = 'currentnamespace',
    CURRENT_MODULE = 'currentmodule',
    CURRENT_SUBMODULE = 'currentsubmodule',
    CURRENT_FILE = 'currentfile',
    CURRENT_CLASS = 'currentclass',

    REGEX_TYPE = /(.*)\{(.*)\}(.*)/,
    REGEX_FIRSTWORD = /^\s*?([^\s]+)(.*)/,
    REGEX_OPTIONAL = /\[(.*)\]/,
    REGEX_START_COMMENT = /^\s*\/\*\*/,
    REGEX_END_COMMENT = /\*\/\s*$/,
    REGEX_LINES = /\r\n|\n/,

    /**
     * A list of known tags.  This populates a member variable
     * during initialization, and will be updated if additional
     * digesters are added.
     * @property TAGLIST
     * @inner
     * @final
     */
    TAGLIST = [
        "async",  // bool, custom events can fire the listeners in a setTimeout
        "attribute", // YUI attributes -- get/set with change notification, etc
        "beta",  // module maturity identifier
        "broadcast",  // bool, events
        "bubbles", // custom events that bubble
        "category", // modules can be in multiple categories
        "chainable", // methods that return the host object
        "class", // pseudo class
        "conditional", // conditional module
        "config", // a config param (not an attribute, so no change events)
        "const", // not standardized yet, converts to final property
        "constructs", // factory methods (not yet used)
        "constructor", // this is a constructor
        "default", // property/attribute default value
        "deprecated", // please specify what to use instead
        "description", // can also be free text at the beginning of a comment is
        "emitfacade",  // bool, YUI custom event can have a dom-like event facade
        "extension", // this is an extension for [entity]
        "fireonce",  // bool, YUI custom event config allows
        "event", // YUI custom event
        "example", // 0..n code snippets.  snippets can also be embedded in the desc
        "experimental",  // module maturity identifier
        "extends", // pseudo inheritance
        "file", // file name (used by the parser)
        "final", // not meant to be changed
        "for", // used to change class context
        "global", // declare your globals
        "in", // indicates module this lives in (obsolete now)
        "initonly", // attribute writeonce value
        "knownissue", // 0..n known issues for your consumption
        "line", // line number for the comment block (used by the parser)
        "method", // a method
        "module", // YUI module name
        "namespace", // Y.namespace, used to fully qualify class names
        "optional", // for module requirements (like 'requires')
        "param", // member param
        "plugin", // this is a plugin for [entityl]
        "preventable", // YUI custom events can be preventable ala DOM events
        "private", // > access
        "property", // a regular-ole property
        "protected", // > access
        "public", // > access
        "queuable",  // bool, events
        "readonly", // YUI attribute config
        "requires", // YUI module requirements
        "return", // {type} return desc -- returns is converted to this
        "see", // 0..n things to look at
        "since", // when it was introduced
        "static",  // static
        "submodule", // YUI submodule
        "throws", // {execption type} description
        "title", // this should be something for the project description
        "todo", // 0..n things to revisit eventually (hopefully)
        "type", // the var type
        "uses", // 0..n compents mixed (usually, via augment) into the prototype
        "value", // the value of a constant
        "writeonce" // YUI attribute config
    ],

    /**
     * Common errors will get scrubbed instead of being ignored.
     * @property CORRECTIONS
     * @inner
     * @final
     */
    CORRECTIONS = {
        'augments': 'uses', // YUI convention for prototype mixins
        'depreciated': 'deprecated', // subtle difference
        'desciption': 'description', // shouldn't need the @description tag at all
        'extend': 'extends', // typo
        'function': 'method', // we may want standalone inner functions at some point
        'member': 'method', // probably meant method
        'parm': 'param', // typo
        'propery': 'property', // typo
        'returns': 'return' // need to standardize on one or the other
    },

    /**
     * A map of the default tag processors, keyed by the
     * tag name.  Multiple tags can use the same digester
     * by supplying the string name that points to the
     * implementation rather than a function.
     * @property DIGESTERS
     * @inner
     * @final
     */
    DIGESTERS = {

        // @param {type} name description    -or-
        // @param name {type} description
        // #2173362 optional w/ or w/o default
        // @param {type} [optvar=default] description
        // #12 document config objects
        // @param {object|config} config description
        // @param {type} config.prop1 description
        // @param {type} config.prop2 description
        // #11 document callback argument signature
        // @param {callback|function} callback description
        // @param {type} callback.arg1 description
        // @param {type} callback.arg2 description
        // #2173362 document event facade decorations for custom events
        // @param {event} event description
        // @param {type}  event.child description
        // @param {type}  event.index description
        'param': function(tagname, value, target, block) {
            // Y.log('param digester' + value);
            target.params = target.params || [];

            if (!value) {
Y.log('param name/type/descript missing: ' + stringify(block, null, 4), 'warn');
                return;
            }

            var type, name, desc = trim(value),
                match = REGEX_TYPE.exec(desc),
                optional, optdefault, parent,
                host = target.params;

            // Extract {type}
            if (match) {
                type = trim(match[2]);
                desc = trim(match[1] + match[3]);
            }

            // extract the first word, this is the param name
            match = REGEX_FIRSTWORD.exec(desc);
            if (match) {
                name = trim(match[1]);
                desc = trim(match[2]);
            }

            if (!name) {
Y.log('param name missing: ' + value + ':' + stringify(block, null, 4), 'warn');
                name = 'UNKNOWN';
            }

            // extract [name], optional param
            if (name.indexOf('[') > -1) {
                match = REGEX_OPTIONAL.exec(name);
                if (match) {
                    optional = true;
                    name = trim(match[1]);
                    // extract optional=defaultvalue
                    parts = name.split('=');
                    if (parts.length > 1) {
                        name = parts[0];
                        optdefault = parts[1];
                    }
                }
            }

            // parse object.prop, indicating a child property for object
            if (name.indexOf('.') > -1) {
                match = name.split('.');
                parent = trim(match[0]);

                Y.some(target.params, function(param) {
                    if (param.name == parent) {
                        param.props = param.props || [];
                        host = param.props;
                        name = trim(match[1]);
                        return true;
                    }
                });
            }

            result = {
                name: name,
                description: desc
            };

            if (type) {
                result.type = type;
            }

            if (optional) {
                result.optional = true;
                if (optdefault) {
                    result.optdefault = optdefault;
                }
            }

            host.push(result);

        },

        // @return {type} description // methods
        // @returns {type} description // methods
        // @throws {type} an error #2173342
        // can be used by anthing that has an optional {type} and a description
        'return': function(tagname, value, target, block) {

            var desc = value, type, match = REGEX_TYPE.exec(desc),
                result = {};
            if (match) {
                type = trim(match[2]);
                desc = trim(match[1] + match[3]);
            }

            result = {
                description: desc
            };

            if (type) {
                result.type = type;
            }

            target[tagname] = result;

        },
        'throws': 'return',

        // trying to overwrite the constructor value is a bad idea
        'constructor': function(tagname, value, target, block) {
            target.is_constructor = 1;
        },

        // @author {twitter: @arthurdent | github: ArthurDent}
        //    Arthur Dent adent@h2g2.earth #23, multiple // modules/class/method
        // 'author': function(tagname, value, target, block) {
        //     // Y.log('author digester');
        // },

        // A key bock type for declaring modules and submodules
        // subsequent class and member blocks will be assigned
        // to this module.
        'module': function(tagname, value, target, block) {
            this.set(CURRENT_MODULE, value);
            var go = true;
            Y.some(block, function(o) {
                if (trim(o.tag) == 'submodule') {
                    go = false;
                    return true;
                }
            });
            if (go) {
                host = this.modules[value];
                return host;
            }
            return null;
        },

        // A key bock type for declaring submodules.  subsequent class and
        // member blocks will be assigned to this submodule.
        'submodule': function(tagname, value, target, block) {
            this.set(CURRENT_SUBMODULE, value);
            var host = this.modules[value],
                parent = this.get(CURRENT_MODULE);
                if (parent) {
                    host.module = parent;
                }
            return host;
        },

        // A key bock type for declaring classes, subsequent
        // member blocks will be assigned to this class
        'class': function(tagname, value, target, block) {
            this.set(CURRENT_CLASS, value);
            var fullname = this.get(CURRENT_CLASS);
            var host = this.classes[fullname],
                parent = this.get(CURRENT_MODULE);
            if (parent) {
                host.module = parent;
            }
            parent = this.get(CURRENT_SUBMODULE);
            if (parent) {
                host.submodule = parent;
            }
            return host;
        },

        // change 'const' to final property
        'const': function(tagname, value, target, block) {
            target.itemtype = property;
            target.name = value;
            target.final = ''
        },

        // supported classitems
        'property': function(tagname, value, target, block) {
            target.itemtype = tagname;
            target.name = value;
        },
        'method': 'property',
        'attribute': 'property',
        'config': 'property',
        'event': 'property',

        // access fields
        'public': function(tagname, value, target, block) {
            target.access = tagname;
            target.tagname = value;
        },
        'private': 'public',
        'protected': 'public',
        'inner': 'public',

        // tags that can have multiple occurances in a single block
        'todo': function(tagname, value, target, block) {
            if (!Lang.isArray(target[tagname])) {
                target[tagname] = [];
            }
            target[tagname].push(value);
        },
        'example': 'todo',
        'author': 'todo',
        'see': 'todo',
        'throws': 'todo',
        'requires': 'todo',
        'knownissue': 'todo',
        'optional': 'todo',
        'uses': 'todo',
        'category': 'todo',

        // updates the current namespace
        'namespace': function(tagname, value, target, block) {
            this.set(CURRENT_NAMESPACE, value);
            var file = this.get(CURRENT_FILE);
            if (file) {
                this.files[file].namespaces[value] = 1;
            }
            var mod = this.get(CURRENT_MODULE);
            if (mod) {
                this.modules[mod].namespaces[value] = 1;
            }

            var mod = this.get(CURRENT_SUBMODULE);
            if (mod) {
                this.modules[mod].namespaces[value] = 1;
            }
        },

        // updates the current class only (doesn't create
        // a new class definition)
        'for': function(tagname, value, target, block) {
            this.set(CURRENT_CLASS, value);
            var file = this.get(CURRENT_FILE);
            if (file) {
                this.files[file].fors[value] = 1;
            }
            var mod = this.get(CURRENT_MODULE);
            if (mod) {
                this.modules[mod].fors[value] = 1;
            }

            var mod = this.get(CURRENT_SUBMODULE);
            if (mod) {
                this.modules[mod].fors[value];
            }
        }

    },

    /**
     * The doc parser accepts a map of files to file content.
     * Once parse() is called, various properties will be populated
     * with the parsers data (aggregated in the 'data' property).
     * @class DocParser
     * @constructor
     * @param o the config object
     */
    DocParser = function(o) {
        this.digesters = Y.merge(DIGESTERS);
        this.knowntags = Y.Array.hash(TAGLIST);
        DocParser.superclass.constructor.apply(this, arguments);
    };

    DocParser.NAME = 'DocParser';

    DocParser.ATTRS = {
        /**
         * Digesters process the tag/text pairs found in a
         * comment block.  They are looked up by tag name.
         * The digester gets the tagname, the value, the
         * target object to apply values to, and the full
         * block that is being processed.  Digesters can
         * be declared as strings instead of a function --
         * in that case, the program will try to look up
         * the key listed and use the function there instead
         * (it is an alias).  Digesters can return a host
         * object in the case the tag defines a new key
         * block type (modules/classes/methods/events/properties)
         * @attribute digesters
         */
        digesters: {
            setter: function(val) {
                Y.mix(this.digesters, val, true);
                Y.mix(this.knowntags, val, true);
                return val;
            }
        },

        /**
         * Emitters will be schemas for the types of payloads
         * the parser will emit.  Not implemented.
         * @attribute emitters
         */
        emitters: {
            setter: function(val) {
                Y.mix(this.emitters, val, true);
            }
        },

        /**
         * The map of file names to file content.
         * @attribute filemap
         */
        filemap: {
            writeOnce : true
        },

        /**
         * A map of file names to directory name.  Provided in
         * case this needs to be used to reset the module name
         * appropriately -- currently not used
         * @attribute dirmap
         */
        dirmap: {
            writeOnce : true
        },

        /**
         * The file currently being parsed
         * @attribute currentfile
         */
        currentfile: {
            setter: function(val) {
                val = trim(val);
                // this.set(CURRENT_NAMESPACE, '');
                if (!(val in this.files)) {
                    this.files[val] = {
                        name: val,
                        modules: {},
                        classes: {},
                        fors: {},
                        namespaces: {}
                    };
                }
                return val;
            }
        },

        /**
         * The module currently being parsed
         * @attribute currentmodule
         */
        currentmodule: {
            setter: function(val) {
                if (!val) {
                    return val;
                }
                val = trim(val);
                this.set(CURRENT_SUBMODULE, '');
                this.set(CURRENT_NAMESPACE, '');
                if (!(val in this.modules)) {
                    this.modules[val] = {
                        name: val,
                        submodules: {},
                        classes: {},
                        fors: {},
                        namespaces: {}
                    };
                }
                return val;
            }
        },

        /**
         * The submodule currently being parsed
         * @attribute currentsubmodule
         */
        currentsubmodule: {
            setter: function(val) {
                if (!val) {
                    return val;
                }
                val = trim(val);
                if (!(val in this.modules)) {
                    var mod = this.modules[val] = {
                        name: val,
                        submodules: {},
                        classes: {},
                        fors: {},
                        is_submodule: 1,
                        namespaces: {}
                    };
                    mod.module = this.get(CURRENT_MODULE);
                    mod.namespace = this.get(CURRENT_NAMESPACE);
                }
                return val;
            }
        },

        /**
         * The class currently being parsed
         * @attribute currentclass
         */
        currentclass: {
            setter: function(val) {
                if (!val) {
                    return val;
                }
                val = trim(val);
                if (!(val in this.classes)) {
                    var ns = this.get(CURRENT_NAMESPACE),
                        name = (ns) ? ns + '.' + val : val,
                        clazz = this.classes[name] = {
                            name: name,
                            shortname: val,
                            classitems: [],
                            plugins: [],
                            extensions: [],
                            plugin_for: [],
                            extension_for: []
                        };
                    clazz.module = this.get(CURRENT_MODULE);
                    clazz.submodule = this.get(CURRENT_SUBMODULE)
                    clazz.namespace = ns;
                }
                return name;
            }
        }
    };

    Y.extend(DocParser, Y.Base, {

        initializer: function() {

            var self = this;

            self.after('currentmoduleChange', function(e) {
                var mod = e.newVal, classes = self.classes;
                Y.each(classes, function(clazz) {
                    if (!(clazz.module)) {
                        clazz.module = mod;
                    }
                });
            });

            self.after('currentsubmoduleChange', function(e) {
                var mod = e.newVal, classes = self.classes,
                    parent;

                if (mod) {
                    parent = self.modules[mod].module;
                    Y.each(classes, function(clazz) {
                        if (!(clazz.submodule)) {
                            if ((!clazz.module) || clazz.module == parent) {
                                clazz.submodule = mod;
                            }
                        }
                    });
                }
            });

            self.after('currentclassChange', function(e) {
                var clazz = e.newVal;
                Y.each(self.classitems, function(item) {
                    if (!(item["class"])) {
                        item["class"] = clazz;
                    }
                });
                // Y.log(self.classitems);
            });

        },

        /**
         * Transforms a JavaDoc style comment block (less the start
         * and end of it) into a list
         * of tag/text pairs.  The leading space and '*' are removed,
         * but the remaining whitespace is preserved so that the
         * output should be friendly for both markdown and html
         * parsers.
         */
        handlecomment: function(comment, file, line) {
            var lines = comment.split(REGEX_LINES),
                len = lines.length, i,
                parts, part, peek, skip,
                results = [{tag: 'file', value: file},
                           {tag: 'line', value: line}],
                linefix = /^\s*\*\s?/;

// trim leading space and *, preserve the rest of the white space
            for (i = 0; i < len; i++) {
                lines[i] = lines[i].replace(linefix, ' ');
            }

// reconsitute and tokenize the comment block
            comment = lines.join('\n');
            parts = comment.split(/ (@\w*)/);
            len = parts.length;
            for (i = 0; i < len; i++) {
                value = '';
                part = parts[i];
                skip = false;

// the first token may be the description, otherwise it should be a tag
                if (i === 0 && part.substr(0, 1) !== '@') {
                    if (part) {
                        tag = '@description';
                        value = part;
                    } else {
                        skip = true;
                    }
                } else {
                    tag = part;
                    // lookahead for the tag value
                    peek = parts[i + 1];
                    if (peek) {
                        value = peek;
                        i++;
                    }
                }

                if (!skip && tag) {
                    results.push({
                        tag: tag.substr(1).toLowerCase(),
                        value: value
                    });
                }
            }

            return results;
        },

        /**
         * Accepts a map of filenames to file content.  Returns
         * a map of filenames to an array of API comment block
         * text.  This expects the comment to start with / **
         * on its own line, and end with &amp;/ on its own
         * line.  Override this function to provide an
         * alternative comment parser.
         * @method extract
         * @param {Object} filemap a map of filenames to file content'
         * @return {Object} a map of filenames to an array of extracted
         * comment text.
         */
        extract: function(filemap, dirmap) {
            filemap = filemap || this.get('filemap');
            dirmap = dirmap || this.get('dirmap');
            var commentmap = {};
            Y.each(filemap, function(code, filename) {

                var commentlines, comment,
                    lines = code.split(REGEX_LINES),
                    len = lines.length, i, linenum;

                for (i = 0; i < len; i++) {
                    line = lines[i];
                    if(REGEX_START_COMMENT.test(line)) {
                        commentlines = [];

                        linenum = i + 1;

                        while (i < len && (!REGEX_END_COMMENT.test(line))) {
                            commentlines.push(line);
                            i++;
                            line = lines[i];
                        }

                        // we can look ahead here if we need to guess the
                        // name/type like we do in the python version.

                        // remove /**
                        commentlines.shift();
                        comment = commentlines.join('\n');
                        commentmap[filename] = commentmap[filename] || [];
                        commentmap[filename]
                          .push(this.handlecomment(comment, filename, linenum));
                    }
                }
            }, this);

            this.commentmap = commentmap;
            return commentmap;
        },

        /**
         * Processes all the tags in a single comment block
         * @method processblock
         * @param {Array} an array of the tag/text pairs
         */
        processblock: function(block) {
            var target = {},
                clazz,
                module,
                submodule,
                digestname,
                digester,
                host;
            // Y.log(block);
            Y.each(block, function(tag) {
                var name = trim(tag.tag),
                    value = trim(tag.value),
                    parent, ret;

                if (tag && tag.tag) {

                    if (!(name in this.knowntags)) {
                        if (name in CORRECTIONS) {
Y.log('replacing incorrect tag: ' + name + ' with ' + CORRECTIONS[name], 'warn');
// Y.log(stringify(block, null, 4), 'warn');

                            name = CORRECTIONS[name];
                        } else {
Y.log('unknown tag: ' + name + ',' + stringify(block, null, 4), 'warn');
                        }
                    }
                    digestname = name;
                    if (digestname in this.digesters) {
                        digester = this.digesters[digestname];
                        if (Lang.isString(digester)) {
                            digester = this.digesters[digester];
                        }
                        ret = digester.call(this, name, value, target, block);
                        host = host || ret;
                    } else {
                        target[name] = value;
                    }
                }

            }, this);

            if (host) {
                Y.mix(host, target);
            } else {
                this.classitems.push(target);
                target['class'] = this.get(CURRENT_CLASS);
                target.module = this.get(CURRENT_MODULE);
                host = this.get(CURRENT_SUBMODULE);
                if (host) {
                    target.submodule = host;
                }
                host = this.get(CURRENT_NAMESPACE);
                if (host) {
                    target.namespace = host;
                }
            }
        },

        /**
         * Transforms a map of filenames to arrays of comment blocks into a
         * JSON structure that represents the entire processed API doc info
         * and relationships between elements for the entire project.
         * @method transform
         * @param {object} commentmap
         * @return {object} the transformed data for the project
         */
        transform: function(commentmap) {
            var self = this,
                files = self.files = {},
                modules = self.modules = {},
                classes = self.classes = {},
                classitems = self.classitems = [],
                data = self.data = {
                    files: files,
                    modules: modules,
                    classes: classes,
                    classitems: classitems
                };

            commentmap = commentmap || self.commentmap;

            // process
            Y.each(commentmap, function(blocks, file) {
                Y.log('transform: ' + file);
                self.set(CURRENT_FILE, file);
                Y.each(blocks, function(block) {
                    self.processblock(block);
                });
            });

            // cross reference
            Y.each(modules, function(module, name) {
                if (module.file) {
                    files[module.file].modules[name] = 1;
                }
            });

            Y.each(classes, function(clazz, name) {
                if (clazz.module) {
                    modules[clazz.module].classes[name] = 1;
                }
                if (clazz.submodule) {
                    modules[clazz.submodule].classes[name] = 1;
                }
                if (clazz.file) {
                    files[clazz.file].classes[name] = 1;
                }
            });

            return self;
        },

        /**
         * Extracts and transforms the filemap provided to constructor
         * @method parse
         * @param filemap a map of filenames to file content'
         * @return {DocParser} this parser instance.  The total results
         * are available in parser.data.
         */
        parse: function(filemap, dirmap) {
            filemap = filemap || this.get('filemap');
            dirmap = dirmap || this.get('dirmap');
            return this.transform(this.extract(filemap, dirmap));
        }

    });

    Y.DocParser = DocParser;

}, '0.1.0', { requires: ['base-base', 'json-stringify'] });

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

YUI({
    // filter: 'debug'
}).use('docparser', function(Y) {

var fs = require("fs"),
    sys = require("sys"),
    path = require("path"),

    options = {
        outdir: 'out',
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
        try {
            fs.mkdirSync(options.outdir, 0777);
        } catch(e) { }
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
            var dot = filename.indexOf('.'), ext, text, fullpath;
            if (dot) {
                ext = filename.substr(dot);
                if (ext in options.extensions) {
                    fullpath = path.join(dir, filename);
                    text = fs.readFileSync(fullpath, "utf8");
                    filemap[fullpath] = text;
                    dirmap[fullpath] = dir;
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

