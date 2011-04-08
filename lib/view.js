YUI.add('view', function(Y) {


/*
Selleck
Copyright (c) 2011 Yahoo! Inc.
Licensed under the BSD License.
*/

    /**
    View class borrowed from [Selleck](https://github.com/rgrove/selleck)  
    The view class is a **`mustache`** template helper.
    @class View
    @constructor
    @param {Object} data Meta data to use in this template
    @param {String} templateName The name of the template file to render.
    */
    function View(data, templateName) {
        this.templateName = templateName;
        Y.mix(this, data);
    }

    View.prototype = {
        /**
        * **Mustache** `lambda` method for setting the HTML title
        * @method htmlTitle
        */
        htmlTitle: function () {
            var name  = this.displayName || this.name,
                title = name;

            if (title) {
                if (this.projectName) {
                    title += ' - ' + this.projectName;
                }
            } else {
                title = this.projectName;
            }

            return title;
        },

        /**
        * **Mustache** `lambda` method for setting the title
        * @method title
        */
        title: function () {
            var name  = this.displayName || this.name,
                title = this.projectName;

            if (name) {
                title += ': ' + name;
            }

            return title;
        }
    };

    Y.View = View;
});
