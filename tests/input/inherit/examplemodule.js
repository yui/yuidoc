/**
 * @module ExampleModule
 */

YUI.add('examplemodule', function (Y) {
        Y.namespace('mywidget');
        
        /**
         * Superclass description.
         * 
         * @constructor
         * @class SuperWidget
         * @namespace mywidget
         */
        Y.mywidget.superwidget = Y.Base.create("mysuperwidget", Y.Widget, [], {
                
                /**
                 * Supermethod description.
                 * 
                 * @method myMethod
                 */
                myMethod: function () {}
                 
        }, {
        
        });
        
        /**
         * Subclass description.
         * 
         * @constructor
         * @class SubWidget
         * @extends mywidget.SuperWidget
         * @namespace mywidget
         */
        Y.mywidget.superwidget = Y.Base.create("mysuperwidget", Y.mywidget.superwidget, [], {
                
                /**
                 * Submethod description.
                 * 
                 * @method myMethod
                 */
                myMethod: function () {}
                 
        }, {
        
        });
});
