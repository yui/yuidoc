var path = require('path'),
    util = require('util'),
    fs = require('fs');

/**
* Utilities Class
* @class utils
* @module yuidoc
*/

YUI.add('utils', function(Y) {
    
var HTML_CHARS = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;'
};

    /**
    Escapes HTML characters in _html_.

    @method escapeHTML
    @param {String} html String to escape.
    @return {String} Escaped string.
    **/
    Y.escapeHTML = function(html) {
        return html.replace(/[&<>"'\/`]/g, function (match) {
            return HTML_CHARS[match];
        });
    };

    /**
    Normalizes the initial indentation of the given _content_ so that the first line
    is unindented, and all other lines are unindented to the same degree as the
    first line. So if the first line has four spaces at the beginning, then all
    lines will be unindented four spaces.

    @method unindent
    @param {String} content Text to unindent.
    @return {String} Unindented text.
    @private
    **/
    Y.unindent = function(content) {
        var indent = content.match(/^(\s+)/);

        if (indent) {
            content = content.replace(new RegExp('^' + indent[1], 'gm'), '');
        }

        return content;
    };
    
/**
Like `getPages()`, but returns only the files under the `layout/` subdirectory
of the specified _dir_.

@method getLayouts
@param {String} dir Directory path.
@return {Object} Mapping of layout names to layout content.
**/
function getLayouts(dir) {
    return getPages(path.join(dir, 'layouts'));
}
Y.getLayouts = getLayouts;

/**
Loads and returns the content of the specified page file.

@method getPage
@param {String} pagePath Path to a single `.handlebars` page.
@return {String|null} Page content, or `null` if not found.
**/
function getPage(pagePath) {
    if (!Y.Files.isFile(pagePath)) { return null; }
    return fs.readFileSync(pagePath, 'utf8');
}
Y.getPage = getPage;

/**
Loads pages (files with a `.handlebars` extension) in the specified directory and
returns an object containing a mapping of page names (the part of the filename)
preceding the `.handlebars` extension) to page content.

@method getPages
@param {String} dir Directory path.
@return {Object} Mapping of page names to page content.
**/
var cache = {};
function getPages(dir) {
    if (cache[dir]) {
        return cache[dir];
    }
    var pages = {};

    if (!Y.Files.isDirectory(dir)) { return pages; }

    fs.readdirSync(dir).forEach(function (filename) {
        var filePath = path.join(dir, filename);

        if (path.extname(filename) === '.handlebars' && Y.Files.isFile(filePath)) {
            pages[path.basename(filename, '.handlebars')] = fs.readFileSync(filePath, 'utf8');
        }
    });
    cache[dir] = pages;

    return pages;
}
Y.getPages = getPages;

/**
Like `getPages()`, but returns only the files under the `partial/` subdirectory
of the specified _dir_.

@method getPartials
@param {String} dir Directory path.
@return {Object} Mapping of partial names to partial content.
**/
function getPartials(dir) {
    return getPages(path.join(dir, 'partials'));
}
Y.getPartials = getPartials;


/**
Mix/merge/munge data into the template.
@method prepare
@param {String} inDir The starting directory
@param {Object} options The `options` for the meta data.
@param {callback}
@param {Error} callback.err
@param {Object} callback.options Merged options.
**/
function prepare(inDir, options, callback) {
    var compiled = {},
        meta     = {},
        type     = 'project';

    if (options && options.skipLoad) {
        // Skip loading layouts, metadata, pages, and partials and assume that
        // the caller has provided them if they want them.
        options = Y.merge({
            layouts  : {},
            meta     : {},
            pages    : {},
            partials : {},
            viewClass: Y.DocView
        }, options);
    } else {

        // Gather layouts, metadata, pages, and partials from the specified
        // input directory, then merge them into the provided options (if any).
        //
        // Gathered data will override provided data if there are conflicts, in
        // order to support a use case where global data are provided by the
        // caller and overridden by more specific component-level data gathered
        // from the input directory.
        //
        // The metadata inheritance chain looks like this:
        //
        //   - override metadata specified via CLI (highest precedence)
        //   - component metadata (if this is a component)
        //   - project-level component default metadata (if specified and this is a component)
        //   - theme-level component default metadata (if specified and this is a component)
        //   - project metadata
        //   - theme metadata (lowest precedence)

        try {
            options = Y.merge(
                {viewClass: Y.DocView},
                options || {},
                {
                    layouts : getLayouts(inDir),
                    meta    : options.meta,
                    partials: getPartials(inDir)
                }
            );
        } catch (ex) {
            return callback(ex);
        }
    }

    // Pages are never merged.
    options.pages = getPages(inDir);

    // Mix in the override metadata, if any. It takes precedence over everything
    // else.
    Y.mix(options.meta, options.overrideMeta);

    // Set a default asset path if one isn't specified in the metadata.
    if (!options.meta.projectAssets) {
        options.meta.projectAssets = options.component ? '../assets' : 'assets';
    }

    if (!options.meta.componentAssets && options.component) {
        options.meta.componentAssets = '../assets/' + options.meta.name;
    }

    if (typeof options.meta.layout === 'undefined') {
        options.meta.layout = options.layouts[type] ? type : 'main';
    }
    
    callback(null, options);
}

Y.prepare = prepare;


var projectData;
/**
* Walk the directory tree to locate the yuidoc.json file.
* @method getProjectData
* @param {Path} [dir=process.cwd()] The directory to start from
*/
var getProjectData = function(dir) {
    if (!dir) {
        dir = process.cwd();
    }
    var dirs = fs.readdirSync(dir);
    dirs.forEach(function(d) {
        var p = path.join(dir, d);
        if (projectData) {
            return;
        }
        if (Y.Files.isFile(p)) {
            if (d === 'yuidoc.json') {
                projectData = Y.Files.getJSON(p);
            }
        }
        if (!projectData && Y.Files.isDirectory(p)) {
            projectData = getProjectData(p);
        }
    });
    return projectData;
};

Y.getProjectData = getProjectData;


/**
* Make sure all the paths passed are directories and that they are not in the ignore list.
* @method validatePaths
* @param {Array} paths The array of paths to validate
* @param {String} [ignore=false] A string to call `.indexOf` on a path to determine if it should be ignored
*/

var validatePaths = function(paths, ignore) {
    if (!paths || !paths.forEach) {
        paths = [ process.cwd() ];
    }
    if (paths.forEach) {
        paths.forEach(function(p) {
            if (!Y.Files.isDirectory(p)) {
                throw('Path not a directory: ' + p);
            }
        });
    }
    if (!paths || !paths.forEach) {
        throw('Paths should be an array of paths');
    }
    if (ignore) {
        if (!(ignore instanceof Array)) {
            ignore = [ignore];
        }
        var p = [];
        paths.forEach(function(v) {
            ignore.forEach(function(i) {
                if (v.indexOf(i) === -1) {
                    p.push(v);
                }
            });
        });
        paths = p;
    }
    return paths;
};

Y.validatePaths = validatePaths;

});
