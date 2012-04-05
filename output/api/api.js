YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "DocBuilder",
        "DocParser",
        "DocView",
        "Files",
        "Server",
        "YUIDoc",
        "cli",
        "index",
        "utils"
    ],
    "modules": [
        "server",
        "yuidoc"
    ],
    "allModules": [
        {
            "displayName": "server",
            "name": "server",
            "description": "Provides the `--server` server option for YUIDoc"
        },
        {
            "displayName": "yuidoc",
            "name": "yuidoc",
            "description": "This is the __module__ description for the `YUIDoc` module.\n\n    var options = {\n        paths: [ './lib' ],\n        outdir: './out'\n    };\n\n    var Y = require('yuidoc');\n    var json = (new Y.YUIDoc(options)).run();"
        }
    ]
} };
});