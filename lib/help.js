YUI.add('help', function(Y) {

    var help = [
        "YUI Doc generates api documentation from a modified JavaDoc syntax.",
        "",
        "Usage: yuidoc [options] [input path]",
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
        "",
        ""
    ].join('\n');



    Y.showHelp = function() {
        console.error(help);
        process.exit(1);
    }
});
