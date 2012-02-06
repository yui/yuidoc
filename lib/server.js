YUI.add('server', function(Y) {
    
    var Server = {
        parse: function(req, res, next) {
            var json = (new Y.YUIDoc(Server.options)).run();
            Server.builder = new Y.DocBuilder(Server.options, json);
            next();
        },
        routes: function() {
            var app = Server.app;

            app.get('/', Server.parse, function(req, res) {
                Server.home(req, res);
            });
            app.get('/api.js', function(req, res) {
                Server.builder.renderAPIMeta(function(js) {
                    res.contentType('.js');
                    res.send(js);
                });
            });


            app.get('/classes/:class.html', Server.parse, function(req, res) {
                Server.clazz(req, res);
            });

            app.get('/modules/:module.html', Server.parse, function(req, res) {
                Server.module(req, res);
            });

            app.get('/files/:file.html', Server.parse, function(req, res) {
                Server.files(req, res);
            });
            
            //These routes are special catch routes..

            app.get('//api.js', function(req, res) {
                res.redirect('/api.js');
            });
            app.get('//classes/:class.html', Server.parse, function(req, res) {
                Server.clazz(req, res);
            });

            app.get('//modules/:module.html', Server.parse, function(req, res) {
                Server.module(req, res);
            });

            app.get('//files/:file.html', Server.parse, function(req, res) {
                Server.files(req, res);
            });

        },
        files: function(req, res) {
            var fileName = req.params.file;
            var data;
            Object.keys(Server.builder.data.files).forEach(function(file) {
                if (fileName === Server.builder.filterFileName(file)) {
                    data = Server.builder.data.files[file];
                }
            });
            Y.log('Serving /files/' + data.name, 'info', 'server');

            Server.builder.renderFile(function(html) {
                res.send(html);
            }, data, (req.xhr ? 'xhr' : 'main'));
        },
        clazz: function(req, res) {
            var className = req.params['class'];
            Y.log('Serving /classes/' + className + '.html', 'info', 'server');
            Server.builder.renderClass(function(html) {
                res.send(html);
            }, Server.builder.data.classes[className], (req.xhr ? 'xhr' : 'main'));
        },
        module: function(req, res) {
            var modName = req.params.module;
            Y.log('Serving /modules/' + modName + '.html', 'info', 'server');
            Server.builder.renderModule(function(html) {
                res.send(html);
            }, Server.builder.data.modules[modName], (req.xhr ? 'xhr' : 'main'));
        },
        home: function(req, res) {
            Y.log('Serving index.html', 'info', 'server');
            Server.builder.renderIndex(function(html) {
                res.send(html);
            });
        },
        init: function() {
            var express = require('express'),
                path = require('path');


            Server.app = express.createServer();
            var stat = path.join(__dirname, '../', 'themes', 'default');
            Server.app.use(express.static(stat));
            Server.routes();
            Server.app.listen(Server.options.port);

            Y.config.logExclude.yuidoc = true;
            Y.config.logExclude.docparser = true;
            Y.config.logExclude.builder = true;

        },
        start: function(options) {
            Server.options = options;
            Server.options.cacheTemplates = false; //Don't cache the Handlebars templates
            Server.options.writeJSON = false; //Don't write the JSON file out
            Y.log('Starting server: http:/'+'/127.0.0.1:' + options.port, 'info', 'server');
            Server.init();
        }
    };

    Y.Server = Server;
});
