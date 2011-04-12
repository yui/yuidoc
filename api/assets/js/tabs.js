YUI().use('tabview', function(Y) {
    var classdocs = Y.one('#classdocs');
    if (classdocs) {
        if (classdocs.all('li').size()) {
            var tabview = new Y.TabView({ srcNode: classdocs });
            tabview.render();
        }
    }
});
