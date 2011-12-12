/*
Copyright (c) 2011, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/
YUI.add('help', function(Y) {

    var help = [
        "",
        "YUI Doc generates API documentation from a modified JavaDoc syntax.",
        "",
        "Current version ({VERSION})",
        "",
        "Usage: yuidoc <options> <input path>",
        "",
        "Common Options:",
        "  -c, --config, --configfile <filename>  A JSON config file to provide configuration data.",
        "           You can also create a yuidoc.json file and place it",
        "           anywhere under your source tree and YUI Doc will find it",
        "           and use it.",
        "  -e, --extension <comma sep list of file extensions> The list of file extensions to parse ",
        "           for api documentation. (defaults to .js)",
        "  -x, --exclude <comma sep list of directorues> Directorys to exclude from parsing ",
        "           (defaults to '.DS_Store,.svn,CVS,.git,build_rollup_tmp,build_tmp')",
        "  -v, --version Show the current YUIDoc version",
        "  --project-version Set the doc version for the template",
        "  -N, --no-color Turn off terminal colors (for automation)",
        "  -n, --norecurse Do not recurse directories (default is to recurse)",
        "  -S, --selleck Look for Selleck component data and attach to API meta data",
        "  -V, --view Dump the Handlebars.js view data instead of writing template files",
        "  -p, --parse-only Only parse the API docs and create the JSON data, do not render templates",
        "  -o, --out <directory path> Path to put the generated files (defaults to ./out)",
        "  -t, --themedir <directory path> Path to a custom theme directory containing Handlebars templates",
        "  -h, --help Show this help",
        "  -T, --theme <simple|default> Choose one of the built in themes (default is default)",
        "",
        "  <input path> Supply a list of paths (shell globbing is handy here)",
        "",
    ].join('\n');



    Y.showHelp = function() {
        console.error(Y.Lang.sub(help, {
            VERSION: Y.packageInfo.version
        }));
        process.exit(1);
    }
});
