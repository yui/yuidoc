YUI.add('api-filter', function (Y) {

Y.APIFilter = Y.Base.create('apiFilter', Y.Base, [Y.AutoCompleteBase], {
    // -- Initializer ----------------------------------------------------------
    initializer: function () {
        this._bindUIACBase();
        this._syncUIACBase();
    },
    getDisplayName: function(nameHighlighted, name) {

        //displayName defaults to the highlighted name
        var displayName = nameHighlighted;

        //if there is a module with name then the modules display name is beeing used.
        //TODO: Compare module name by Display name to use the highlighted version of the 
        //modules display name!
        Y.each(Y.YUIDoc.meta.allModules, function(i) {
            if (i.name === name && i.displayName) {
                displayName = i.displayName;
            }
        });

        return displayName;
    }

}, {
    // -- Attributes -----------------------------------------------------------
    ATTRS: {
        resultHighlighter: {
            value: 'phraseMatch'
        },

        // May be set to "classes" or "modules".
        queryType: {
            value: 'classes'
        },

        source: {
            valueFn: function() {
                var self = this;
                return function(q) {
                    var data = Y.YUIDoc.meta[self.get('queryType')],
                        out = [];
                    Y.each(data, function(v) {
                        if (v.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                            out.push(v);
                        }
                    });
                    return out;
                };
            }
        }
    }
});

}, '3.4.0', {requires: [
    'autocomplete-base', 'autocomplete-highlighters', 'autocomplete-sources'
]});
